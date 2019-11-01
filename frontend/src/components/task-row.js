import React from 'react';

function TaskRow(props) {
	return (
		<tr>
			<th scope="row">{props.id}</th>
			<td>{props.title}</td>
			<td>{props.description}</td>
			<td>{props.dateCreated}</td>
			<td>
				<button className="btn btn-info"> &#9998;</button>
			</td>
			<td>
				<button className="btn">&#10003;</button>
			</td>
		</tr>
	);
}

export default TaskRow;
