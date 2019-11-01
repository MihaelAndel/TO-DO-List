import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useState } from 'react';
import Axios from 'axios';

//Ova komponenta obavlja dodavanje novog zadatka u bazu.
//Sastoji se od gumba koji je stalno prikazan i modal dijaloškog
//prozora koji se otvara na klik spomenutog gumba.
function AddTask(props) {
	//Koriste se React hookovi radi jednostavnosti.
	//Komponenta nije velika pa nema smisla da bude klasa.
	//Uz to, React hookovi su novi i zabavni.
	const [show, setShow] = useState(false);
	const [taskTitle, setTitle] = useState('');
	const [taskDescription, setDescription] = useState('');

	const closeModal = () => setShow(false);
	const showModal = () => setShow(true);

	const addTask = async () => {
		try {
			var response = await Axios.post('/post-task', {
				title: taskTitle,
				description: taskDescription
			});
		} catch (e) {
			console.error('Error while adding task, try again.');
		}

		if (response.data.message === 'ok') {
			//Umjesto da se ponovo povlače podaci iz baze,
			//ovdje se stvara novi objekt koji je identičan onome
			//koji je upravo dodan u bazu, te se dodaje u array svih
			//zadataka u stanju App komponente.
			const newTask = {
				_id: response.data.id,
				title: taskTitle,
				description: taskDescription,
				dateCreated: response.data.created
			};

			//Poziv metode glavne App komponente.
			props.addTask(newTask);

			closeModal();
		} else {
			console.error('Error while adding task, try again.');
		}
	};

	return (
		<div>
			<button onClick={showModal} className=" btn btn-dark sticky-button">
				+
			</button>
			<Modal show={show} onHide={closeModal}>
				<Modal.Header closeButton>
					<Modal.Title>Add new task</Modal.Title>
				</Modal.Header>

				<Modal.Body>
					<Form>
						<Form.Label className="text-muted">Task title</Form.Label>
						<Form.Control
							onChange={e => setTitle(e.target.value)}
							type="text"
							placeholder="Title"></Form.Control>
						<Form.Label className="text-muted">Task description</Form.Label>
						<Form.Control
							onChange={e => setDescription(e.target.value)}
							type="text"
							placeholder="Description"></Form.Control>
					</Form>
				</Modal.Body>

				<Modal.Footer>
					<Button onClick={closeModal} variant="secondary">
						Close
					</Button>
					<Button onClick={addTask} type="submit" variant="primary">
						Add task
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	);
}

export default AddTask;
