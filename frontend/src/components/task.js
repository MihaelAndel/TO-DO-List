import React, { useState } from 'react';
import EditModal from './edit-modal';
import DeleteModal from './delete-modal';
import moment from 'moment';
import { useParams, useHistory, Redirect } from 'react-router-dom';
import { Button, Card } from 'react-bootstrap';
import Axios from 'axios';

//Ova komponenta predstavlja detaljni prikaz jednog zadatka.
//Sastoji se od prikaza svih podataka zadatka i tri gumba.
//Jedan gumb vraća korisnika na naslovnicu, točno na mjestu gdje je stao.
//Drugi gumb otvara modal za ažuriranje zadatka, dok treći briše zadatak i vraća korisnika natrag.

function Task(props) {
	const { id } = useParams();

	//Koristi se useHistory hook kako bi se korisnika vratilo
	//natrag i to na točno mjesto gdje je stao.
	const history = useHistory();
	const [show, setShow] = useState(false);
	const [task, setTask] = useState({});

	//Primjena history objekta za vraćanje korisnika.
	const goBack = () => history.goBack();

	if (show) {
		const taskArray = [task];
		return (
			//Ovdje su ponovno iskorištene komponente za brisanje
			//i ažuriranje zadataka s naslovne strane.
			<div className="task-details">
				<Button onClick={goBack} variant="primary" className="back-button">
					&#8592;
				</Button>
				<Card>
					<Card.Body>
						<Card.Title>
							ID{task._id} - {task.title}
						</Card.Title>
						<Card.Text>{task.description}</Card.Text>
						<Card.Text>{moment(task.dateCreated).format('LLL')}</Card.Text>
						<EditModal task={task} editTask={props.editTask}></EditModal>
					</Card.Body>
				</Card>
				<DeleteModal
					deleteTasks={props.deleteTasks}
					tasks={taskArray}
					callback={() => {
						//Ako se ovdje opet ne dohvate podaci iz baze, naslovna strana se neće
						//osvježiti. Vjerojatno postoji neko elegantnije rješenje, ali se nisam mogao sjetiti.
						props.getTasks();
						goBack();
					}}
				/>
			</div>
		);
	} else {
		//Radi (meni) nepoznatog bug-a, morao sam direktno iz baze dohvatiti zadatak,
		//umjesto da samo uzmem objekt koji je spremljen u stanju.
		//Neovisno o tome, dohvaćanje je jako brzo pa tu nema mjerljivog čekanja.
		Axios.get(`/get-task?id=${id}`).then(task => {
			setTask(task.data);
			setShow(true);
		});
		return null;
	}
}
export default Task;
