import React from 'react';
import Axios from 'axios';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import Home from './components/home';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Task from './components/task';

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

			//Ova stanja koriste se za pamćenje
			//prethodnog smjera sortiranja pojedinog polja.
			idSort: 0,
			titleSort: 0,
			descriptionSort: 0,
			dateSort: 0
		};

		this.getTasks = this.getTasks.bind(this);
		this.getTasks();

		//Ove metode moraju se "bind-ati" na App komponentu jer se proslijeđuju njezinoj djeci.
		this.addNewTask = this.addNewTask.bind(this);
		this.editTask = this.editTask.bind(this);

		//Metode za sortiranje sadržaja
		this.sortID = this.sortID.bind(this);
		this.sortTitle = this.sortTitle.bind(this);
		this.sortDescription = this.sortDescription.bind(this);
		this.sortDate = this.sortDate.bind(this);

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
								tasks={this.state.taskList}
								addTask={this.addNewTask}
								editTask={this.editTask}
								sortID={this.sortID}
								sortTitle={this.sortTitle}
								sortDescription={this.sortDescription}
								sortDate={this.sortDate}
								selectedTasks={this.state.selectedTasks}
								selectTask={this.selectTask}
								deselectTask={this.deselectTask}
								deleteTasks={this.deleteTasks}
							/>
						</Route>
						{/* Ruta za detaljni prikaz zadatka.
						Također se koristi parametrizirani url za ID zadatka.*/}
						<Route exact path="/task/:id">
							<Task
								getTasks={this.getTasks}
								editTask={this.editTask}
								deleteTasks={this.deleteTasks}
								tasks={this.state.taskList}></Task>
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
			taskList: tasks.data
		});
	}

	addNewTask(task) {
		//Nije potrebno ponovo dohvaćati zadatke,
		//već se samo se u stanje dodaje novostvoreni zadatak.
		let tasks = this.state.taskList;
		tasks.push(task);
		this.setState({
			taskList: tasks
		});
	}

	editTask(editedTask) {
		//Pronalaženje indeksa ažuriranog zadatka kako se ne bi iz baze morali dohvaćati podaci.
		const taskIndex = this.state.taskList.map(task => task._id).indexOf(editedTask._id);
		let tasks = this.state.taskList;
		//Zamjena starog zadatak s ažuriranom verzijom.
		tasks[taskIndex] = editedTask;

		this.setState({
			taskList: tasks
		});
	}

	selectTask(task) {
		//Odabrani zadatak dodaje se u array odabranih
		//zadataka koji se nalazi u stanju aplikacije.
		let selectedTasks = this.state.selectedTasks;
		selectedTasks.push(task);
		this.setState({ selectedTasks });
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
			taskList: newTasks
		});
	}

	//Metode za sortiranje zadataka.
	//Sav sadržaj se lokalno sortira, tako da se
	//ne povlači sadržaj iz baze pri svakom sortiranju.
	sortID() {
		let tasks = this.state.taskList;
		let direction = this.state.idSort === 0 ? 1 : 0;

		if (this.state.idSort) {
			tasks.sort((a, b) => a._id - b._id);
		} else {
			tasks.sort((a, b) => b._id - a._id);
		}
		this.setState({
			taskList: tasks,
			idSort: direction
		});
	}

	sortTitle() {
		let tasks = this.state.taskList;
		let direction = this.state.titleSort === 0 ? 1 : 0;

		if (this.state.titleSort) {
			tasks.sort((a, b) => (a.title > b.title ? 1 : b.title > a.title ? -1 : 0));
		} else {
			tasks.sort((a, b) => (a.title > b.title ? -1 : b.title > a.title ? 1 : 0));
		}
		this.setState({
			taskList: tasks,
			titleSort: direction
		});
	}

	sortDescription() {
		let tasks = this.state.taskList;
		let direction = this.state.descriptionSort === 0 ? 1 : 0;

		if (this.state.descriptionSort) {
			tasks.sort((a, b) =>
				a.description > b.description ? 1 : b.description > a.description ? -1 : 0
			);
		} else {
			tasks.sort((a, b) =>
				a.description > b.description ? -1 : b.description > a.description ? 1 : 0
			);
		}
		this.setState({
			taskList: tasks,
			descriptionSort: direction
		});
	}

	sortDate() {
		let tasks = this.state.taskList;
		let direction = this.state.dateSort === 0 ? 1 : 0;

		if (!this.state.dateSort) {
			tasks.sort((a, b) => a.dateCreated - b.dateCreated);
		} else {
			tasks.sort((a, b) => b.dateCreated - a.dateCreated);
		}
		this.setState({
			taskList: tasks,
			dateSort: direction
		});
	}
}

export default App;
