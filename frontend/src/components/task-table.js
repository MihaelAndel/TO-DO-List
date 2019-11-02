import React from 'react';
import TaskRow from '../components/task-row';
import { Table, Form } from 'react-bootstrap';

//Komponenta koja predstavlja tablicu koja prikazuje sve zadatke.
//Svakom dijelu headera dodaje se onClick event handler koji
//sortira podatke ovisno o kliknutom polju.
//Ovdje se ništa posebno ne događa, pa nemam daljnih komentara.

function TaskTable(props) {
	return (
		<Table striped>
			<thead className="thead-dark">
				<tr>
					<th onClick={props.sortID} scope="col">
						ID
					</th>
					<th onClick={props.sortTitle} scope="col">
						Title
					</th>
					<th onClick={props.sortDescription} scope="col">
						Description
					</th>
					<th onClick={props.sortDate} scope="col">
						Time created
					</th>
					<th></th>
					<th></th>
					<th></th>
				</tr>
				<tr>
					<th>
						<Form.Control
							onChange={event => {
								props.filterId(event.target.value);
							}}></Form.Control>
					</th>
					<th>
						<Form.Control
							onChange={event => {
								props.filterTitle(event.target.value);
							}}></Form.Control>
					</th>
					<th>
						<Form.Control
							onChange={event => {
								props.filterDescription(event.target.value);
							}}></Form.Control>
					</th>
					<th>
						<Form.Control
							onChange={event => {
								props.filterDate(event.target.value);
							}}></Form.Control>
					</th>
					<th scope="col" className="table-button">
						&#9998;
					</th>
					<th scope="col" className="table-button">
						&#128270;
					</th>
					<th scope="col" className="table-button">
						&#10003;
					</th>
				</tr>
			</thead>
			<tbody>
				{props.tasks.map(task => (
					<TaskRow
						editTask={props.editTask}
						selectTask={props.selectTask}
						deselectTask={props.deselectTask}
						key={task._id}
						task={task}
					/>
				))}
			</tbody>
		</Table>
	);
}

export default TaskTable;
