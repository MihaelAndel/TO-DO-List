import React from 'react';
import Axios from 'axios';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import Home from './components/home';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Task from './components/task';
import moment from 'moment';

class App extends React.Component {
	constructor(props) {
		super(props);

		//U stanju se pamti array svih zadataka iz baze.
		//Glavna komponenta pamti stanje svih zadataka,
		//tako da se bez problema svi (ili neki) zadaci
		//mogu proslijediti drugim komponentama.
		//Sve manipulacije nad stanjem zadataka događaju se lokalno,
		//bez da se ponovo šalje zahtjev bazi.
		this.state = {
			taskList: [],
			selectedTasks: [],
			filterId: [],
			filterTitle: [],
			filterDescription: [],
			filterDate: [],
			visibleTasks: [],

			//Ova stanja koriste se za pamćenje
			//prethodnog smjera sortiranja pojedinog polja.
			idDirection: 0,
			titleDirection: 0,
			descriptionDirection: 0,
			dateDirection: 0
		};

		this.getTasks = this.getTasks.bind(this);
		this.getTasks();

		//Ove metode moraju se "bind-ati" na App komponentu jer se proslijeđuju njezinoj djeci.
		this.addNewTask = this.addNewTask.bind(this);
		this.editTask = this.editTask.bind(this);

		//Metode za sortiranje i filtriranje sadržaja
		this.sortID = this.sortID.bind(this);
		this.sortTitle = this.sortTitle.bind(this);
		this.sortDescription = this.sortDescription.bind(this);
		this.sortDate = this.sortDate.bind(this);
		this.filterId = this.filterId.bind(this);
		this.filterTitle = this.filterTitle.bind(this);
		this.filterDescription = this.filterDescription.bind(this);
		this.filterDate = this.filterDate.bind(this);

		//Metode vezane uz označavanje zadataka za brisanje.
		this.selectTask = this.selectTask.bind(this);
		this.deselectTask = this.deselectTask.bind(this);
		this.deleteTasks = this.deleteTasks.bind(this);
	}

	//Koristim React Router radi preusmjeravanja korisnika na drugu stranicu
	//bez da se sam prozor web preglednika osvježi.
	//Definirane su dvije konkretne rute i jedna fallback ruta koja se
	//pogodi samo kada se upiše nešto što ne pogađa prve dvije.
	//Fallback ruta vraća korisnika na naslovnu stranu.
	render() {
		return (
			<div className="App">
				<BrowserRouter>
					<Switch>
						{/* Ruta za naslovnu stranu, koristi se parametrizirani 
						url za otvaranje određene stranice u paginaciji tablice */}
						<Route path="/home/:page">
							<Home
								tasks={this.state.visibleTasks}
								addTask={this.addNewTask}
								editTask={this.editTask}
								sortID={this.sortID}
								idDirection={this.state.idDirection}
								sortTitle={this.sortTitle}
								titleDirection={this.state.titleDirection}
								sortDescription={this.sortDescription}
								descriptionDirection={this.state.descriptionDirection}
								sortDate={this.sortDate}
								dateDirection={this.state.dateDirection}
								selectedTasks={this.state.selectedTasks}
								selectTask={this.selectTask}
								deselectTask={this.deselectTask}
								deleteTasks={this.deleteTasks}
								filterId={this.filterId}
								filterTitle={this.filterTitle}
								filterDescription={this.filterDescription}
								filterDate={this.filterDate}
							/>
						</Route>
						{/* Ruta za detaljni prikaz zadatka.
						Također se koristi parametrizirani url za ID zadatka.*/}
						<Route exact path="/task/:id">
							<Task
								getTasks={this.getTasks}
								editTask={this.editTask}
								deleteTasks={this.deleteTasks}
								tasks={this.state.visibleTasks}></Task>
						</Route>
						<Route path="/">
							<Redirect to="/home/1" />
						</Route>
					</Switch>
				</BrowserRouter>
			</div>
		);
	}

	async getTasks() {
		//Jednostavno dohvaćanje svih zadataka iz baze.
		let tasks = await Axios.get('/get-all-tasks');
		this.setState({
			taskList: tasks.data,
			visibleTasks: tasks.data,

			//Početna stanja za filtiranje kako
			//bi se mogao izračunati njihov presjek.
			filterId: tasks.data,
			filterTitle: tasks.data,
			filterDescription: tasks.data,
			filterDate: tasks.data
		});
	}

	addNewTask(task) {
		//Nije potrebno ponovo dohvaćati zadatke,
		//već se samo se u stanje dodaje novostvoreni zadatak.
		let tasks = this.state.taskList;
		tasks.push(task);
		this.setState({
			taskList: tasks,
			visibleTasks: tasks
		});
	}

	editTask(editedTask) {
		//Pronalaženje indeksa ažuriranog zadatka kako se ne bi iz baze morali dohvaćati podaci.
		const taskIndex = this.state.taskList.map(task => task._id).indexOf(editedTask._id);
		let tasks = this.state.taskList;
		//Zamjena starog zadatak s ažuriranom verzijom.
		tasks[taskIndex] = editedTask;

		this.setState({
			taskList: tasks,
			visibleTasks: tasks
		});
	}

	selectTask(task) {
		//Odabrani zadatak dodaje se u array odabranih
		//zadataka koji se nalazi u stanju aplikacije.
		const selectedTasks = this.state.selectedTasks;
		selectedTasks.push(task);
		this.setState({ selectedTasks: selectedTasks });
	}

	deselectTask(deselectedTask) {
		//Slično kao i kod ažuriranja zadatka, ovdje se pronalazi indeks deselektiranog zadatka.
		const taskIndex = this.state.selectedTasks.map(task => task._id).indexOf(deselectedTask._id);
		let tasks = this.state.selectedTasks;
		//Deselektirani zadatak miče se iz array-a.
		tasks.splice(taskIndex, 1);
		this.setState({
			selectedTasks: tasks
		});
	}

	deleteTasks() {
		const tasksToDelete = this.state.selectedTasks;
		const allTasks = this.state.taskList;
		//Radi se filtracija postojećeg array-a kako bi se maknuo obrisani zadatak.
		const newTasks = allTasks.filter(task => !tasksToDelete.includes(task));
		this.setState({
			selectedTasks: [],
			taskList: newTasks,
			visibleTasks: newTasks
		});
	}

	//Metode za sortiranje zadataka.
	//Sav sadržaj se lokalno sortira, tako da se
	//ne povlači sadržaj iz baze pri svakom sortiranju.
	sortID() {
		let tasks = this.state.visibleTasks;
		let direction = this.state.idDirection === 0 ? 1 : 0;

		if (this.state.idDirection) {
			tasks.sort((a, b) => a._id - b._id);
		} else {
			tasks.sort((a, b) => b._id - a._id);
		}
		this.setState({
			visibleTasks: tasks,
			idDirection: direction
		});
	}

	sortTitle() {
		let tasks = this.state.visibleTasks;
		let direction = this.state.titleDirection === 0 ? 1 : 0;

		if (this.state.titleDirection) {
			tasks.sort((a, b) => (a.title > b.title ? 1 : b.title > a.title ? -1 : 0));
		} else {
			tasks.sort((a, b) => (a.title > b.title ? -1 : b.title > a.title ? 1 : 0));
		}
		this.setState({
			visibleTasks: tasks,
			titleDirection: direction
		});
	}

	sortDescription() {
		let tasks = this.state.visibleTasks;
		let direction = this.state.descriptionDirection === 0 ? 1 : 0;

		if (this.state.descriptionDirection) {
			tasks.sort((a, b) =>
				a.description > b.description ? 1 : b.description > a.description ? -1 : 0
			);
		} else {
			tasks.sort((a, b) =>
				a.description > b.description ? -1 : b.description > a.description ? 1 : 0
			);
		}
		this.setState({
			visibleTasks: tasks,
			descriptionDirection: direction
		});
	}

	sortDate() {
		let tasks = this.state.visibleTasks;
		let direction = this.state.dateDirection === 0 ? 1 : 0;

		if (!this.state.dateDirection) {
			tasks.sort((a, b) => a.dateCreated - b.dateCreated);
		} else {
			tasks.sort((a, b) => b.dateCreated - a.dateCreated);
		}
		this.setState({
			visibleTasks: tasks,
			dateDirection: direction
		});
	}

	//Metode za filtriranje po svakom pojedinom polju.
	//Metode su jako jako slične, ali ne vidim način
	//na koji bih mogao ponovno iskoristiti određen dio koda.
	//Priznajem da su metode grozne za čitati, ali filtriranje radi.

	//Svaka metoda prvo provjerava radi li se o praznom polju.
	//Ako se radi o praznom stringu, svi zadaci ubacuju se u stanje filtiranja za to polje.
	//Ako je unesen nekakav string, tada se u stanje filtriranja tog polja ubacuju svi zadaci koji sadrže
	//unesen string kao podstring tog polja. Na kraju svake metode poziva se metoda koja radi presjek svih
	//filtriranih zadataka kako bi se zadaci na korektan način prikazali u tablici.
	//Ukratko, filtriranje je moguće napraviti unosom bilo koje kombinacije vrijednosti u bilo koja polja.
	filterId(text) {
		const query = parseInt(text);
		const allTasks = this.state.taskList;

		if (text === '') {
			this.setState(
				{
					filterId: allTasks
				},
				() => this.showTasks()
			);
			return;
		}

		const filteredTasks = allTasks.filter(task => {
			return task._id === query;
		});

		this.setState(
			{
				filterId: filteredTasks
			},
			() => this.showTasks()
		);
	}

	filterTitle(text) {
		const allTasks = this.state.taskList;
		const query = text;

		if (text === '') {
			this.setState(
				{
					filterTitle: allTasks
				},
				() => this.showTasks()
			);
			return;
		}

		const filteredTasks = allTasks.filter(task => {
			return task.title.indexOf(query) > -1;
		});

		this.setState(
			{
				filterTitle: filteredTasks
			},
			() => this.showTasks()
		);
	}

	filterDescription(text) {
		const query = text;
		const allTasks = this.state.taskList;

		if (text === '') {
			this.setState(
				{
					filterDescription: allTasks
				},
				() => this.showTasks()
			);
			return;
		}

		const filteredTasks = allTasks.filter(task => {
			return task.description.indexOf(query) > -1;
		});

		this.setState(
			{
				filterDescription: filteredTasks
			},
			() => this.showTasks()
		);
	}

	filterDate(text) {
		const query = text;
		const allTasks = this.state.taskList;

		if (text === '') {
			this.setState(
				{
					filterDate: allTasks
				},
				() => this.showTasks()
			);
			return;
		}

		const filteredTasks = allTasks.filter(task => {
			const date = moment(task.dateCreated).format('LLL');
			return date.indexOf(query) > -1;
		});

		this.setState(
			{
				filterDate: filteredTasks
			},
			() => this.showTasks()
		);
	}

	//Metoda koja se poziva nakon filtriranja zadataka po bilo kojem polju.
	//Metoda radi presjek svih array-a i postavlja dobivenu vrijednost u stanje
	//zadataka za prikazivanje. Presjek array-a radi se na način da se funkcijom
	//'filter' filtriraju svi zadaci koji pripadaju svim ostalim array-ima
	showTasks() {
		const tasksToShow = this.state.filterId
			.filter(taskId => this.state.filterTitle.includes(taskId))
			.filter(taskTitle => this.state.filterDescription.includes(taskTitle))
			.filter(taskDescription => this.state.filterDate.includes(taskDescription));

		this.setState({
			visibleTasks: tasksToShow
		});
	}
}

export default App;
