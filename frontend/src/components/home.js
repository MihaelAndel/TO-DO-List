import React, { useState } from 'react';
import TaskTable from './task-table';
import AddTask from './add-task';
import DeleteModal from './delete-modal';
import { Pagination, Container, PageItem } from 'react-bootstrap';
import { NavLink, useParams, useHistory } from 'react-router-dom';

//Ova komponenta predstavlja glavni pogled koji se prikazuje nakon otvaranja aplikacije.
//Sastoji se od glavne tablice za zadacima i komponente koja se satoji od gumba koji otvara
//modal dijaloški prozor za dodavanje novih zadataka.
//Osim toga, ova komponenta izračunava i prikazuje paginaciju
//u slučaju da se u bazi nalazi više od 5 zadataka.
function Home(props) {
	const history = useHistory();
	//Varijabla predstavlja trenutnu stranu paginacije, default vrijednost je 1.
	let { page } = useParams();
	let paginations = [];
	let tasksToShow = [];

	//Ako postoji više od 5 zadataka, tada se radi paginacija.
	if (props.tasks.length > 5) {
		const taskNum = props.tasks.length;
		const paginationCount = Math.ceil(taskNum / 5);
		for (let i = 0; i < paginationCount; i++) {
			const pageNum = i + 1;
			paginations.push(
				//Stvaranje objekta koji predstavlja jedan gumb na paginaciji.
				<NavLink key={i} activeClassName="active-link" to={`/home/${pageNum}`}>
					<div className="pagination-item">{pageNum}</div>
				</NavLink>
			);
		}

		//Izračun zadataka za pokazivanje za trenutno odabranu stranicu.
		let startIndex = (page - 1) * 5;
		let endIndex = startIndex + 5;
		tasksToShow = props.tasks.slice(startIndex, endIndex);
	} else {
		tasksToShow = props.tasks;
	}

	return (
		<div>
			<TaskTable
				tasks={tasksToShow}
				sortID={props.sortID}
				sortTitle={props.sortTitle}
				sortDescription={props.sortDescription}
				sortDate={props.sortDate}
				selectTask={props.selectTask}
				deselectTask={props.deselectTask}
				editTask={props.editTask}></TaskTable>
			<AddTask addTask={props.addTask} />
			<Container>
				<Pagination className="pagination-bar" size="lg">
					{paginations}
				</Pagination>
			</Container>
			<DeleteModal
				deleteTasks={props.deleteTasks}
				tasks={props.selectedTasks}
				callback={() => {
					return;
				}}
			/>
		</div>
	);
}

export default Home;
