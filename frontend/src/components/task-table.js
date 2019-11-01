import React from 'react';
import TaskRow from '../components/task-row';
import { Table } from 'react-bootstrap';

function TaskTable(props) {
	return (
		<Table striped hover>
			<thead className="thead-dark">
				<tr>
					<th scope="col">ID</th>
					<th scope="col">Title</th>
					<th scope="col">Description</th>
					<th scope="col">Time created</th>
					<th scope="col">&#9998;</th>
					<th scope="col">&#10003;</th>
				</tr>
			</thead>
			<tbody>
				{props.tasks.map(task => (
					<TaskRow
						key={task._id}
						id={task._id}
						title={task.title}
						description={task.description}
						dateCreated={task.dateCreated}
					/>
				))}
			</tbody>
		</Table>
	);
}

export default TaskTable;
