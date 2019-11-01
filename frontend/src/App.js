import React from 'react';
import Axios from 'axios';
import { BrowserRouter, Link, Route, Redirect } from 'react-router-dom';
import TaskTable from './components/task-table';
import Home from './components/home';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

class App extends React.Component {
	constructor(props) {
		super(props);

		//U stanju se pamti array svih zadataka iz baze.
		//Glavna komponenta pamti stanje svih zadataka,
		//tako da se bez problema svi (ili neki) zadaci
		//mogu proslijediti drugim komponentama.
		this.state = {
			taskList: []
		};

		this.getTasks();

		//Metoda addNewTask mora se "bind-ati" na App komponentu jer se proslijeđuje njezinoj djeci.
		this.addNewTask = this.addNewTask.bind(this);
	}

	render() {
		return (
			<div className="App">
				<BrowserRouter>
					<Route exact path="/">
						<Redirect to="/home" />
					</Route>
					<Route path="/home">
						<Home tasks={this.state.taskList} addTask={this.addNewTask} />
					</Route>
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
		let tasks = this.state.taskList;
		tasks.push(task);
		this.setState({
			taskList: tasks
		});
	}
}

export default App;
