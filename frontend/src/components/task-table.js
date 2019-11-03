import React from 'react';
import TaskRow from '../components/task-row';
import { Table, Form } from 'react-bootstrap';
import Symbol from './symbol';

//Komponenta koja predstavlja tablicu koja prikazuje sve zadatke.
//Svakom dijelu headera dodaje se onClick event handler koji
//sortira podatke ovisno o kliknutom polju.
//Koristi se komponenta Symbol kako bi se mogli prikazati posebni UTF8
//simboli za indikatore usmjerenja sortiranja određenog polja.
function TaskTable(props) {
	return (
		<Table striped>
			<thead className="thead-dark">
				<tr>
					<th onClick={props.sortID} className="id" scope="col">
						ID
						{props.idDirection === 0 ? <Symbol symbol="&#8593;" /> : <Symbol symbol="&#8595;" />}
					</th>
					<th onClick={props.sortTitle} className="title" scope="col">
						Title
						{props.titleDirection === 0 ? <Symbol symbol="&#8593;" /> : <Symbol symbol="&#8595;" />}
					</th>
					<th onClick={props.sortDescription} className="description" scope="col">
						Description
						{props.descriptionDirection === 0 ? (
							<Symbol symbol="&#8593;" />
						) : (
							<Symbol symbol="&#8595;" />
						)}
					</th>
					<th onClick={props.sortDate} className="date" scope="col">
						Time created
						{props.dateDirection === 0 ? <Symbol symbol="&#8593;" /> : <Symbol symbol="&#8595;" />}
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
						selected={props.selectedTasks.includes(task) ? true : false}
					/>
				))}
			</tbody>
		</Table>
	);
}

export default TaskTable;
