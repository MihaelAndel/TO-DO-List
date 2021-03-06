import React from 'react';
import moment from 'moment';
import { useState } from 'react';
import EditModal from './edit-modal';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

//Komponenta koja predstavlja jedan redak tablice.
//Osim prikaza pojedinog zadatka, ona se sastoji od komponente za
//ažuriranje zadatka i dva gumba. Jedan gumb otvara detaljni prikaz zadatka,
//dok drugi označava zadatak.
function TaskRow(props) {
	const [selected, setSelected] = useState(props.selected);

	const toggleSelect = () => {
		if (selected) {
			props.deselectTask(props.task);
			setSelected(false);
		} else {
			props.selectTask(props.task);
			setSelected(true);
		}
	};
	return (
		<tr>
			<th scope="row" className="id">
				{props.task._id}
			</th>
			<td className="title">{props.task.title}</td>
			<td className="description">{props.task.description}</td>

			{/* Formatiranje timestamp vremena iz baze u lokalno
			 vrijeme, ovisno o postavkama računala */}
			<td className="date">{moment(props.task.dateCreated).format('LLL')}</td>

			<td className="table-button">
				<EditModal editTask={props.editTask} task={props.task} />
			</td>
			<td className="table-button">
				<Link to={`/task/${props.task._id}`}>
					<Button variant="outline-info" className="id-button">
						&#128270;
					</Button>
				</Link>
			</td>
			<td className="table-button">
				<Button onClick={toggleSelect} variant={selected ? 'primary' : 'outline-primary'}>
					&#10003;
				</Button>
			</td>
		</tr>
	);
}

export default TaskRow;
