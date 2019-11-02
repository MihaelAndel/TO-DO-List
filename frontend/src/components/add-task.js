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
	const showModal = () => {
		setTitle('');
		setDescription('');
		setShow(true);
	};
	const addTask = async event => {
		console.log('tu sam add');
		const form = event.currentTarget;
		if (form.checkValidity() === false) {
			event.preventDefault();
			event.stopPropagation();
			return;
		}
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
			{/*Gumb koji otvara Modal prozor za dodavanje zadatka*/}
			<Button onClick={showModal} variant="success" className="add-button">
				&#10133;
			</Button>

			<Modal show={show} onHide={closeModal}>
				<Modal.Header closeButton>
					<Modal.Title>Add new task</Modal.Title>
				</Modal.Header>

				<Form validated onSubmit={addTask}>
					<Modal.Body>
						<Form.Label className="text-muted">Task title</Form.Label>
						<Form.Control
							type="text"
							required
							onChange={e => setTitle(e.target.value)}
							type="text"
							placeholder="Title"
							value={taskTitle}></Form.Control>
						<Form.Label className="text-muted">Task description</Form.Label>
						<Form.Control
							type="text"
							required
							onChange={e => setDescription(e.target.value)}
							type="text"
							placeholder="Description"
							value={taskDescription}></Form.Control>
					</Modal.Body>

					<Modal.Footer>
						<Button onClick={closeModal} variant="secondary">
							Close
						</Button>
						<Button type="submit" variant="primary">
							Add task
						</Button>
					</Modal.Footer>
				</Form>
			</Modal>
		</div>
	);
}

export default AddTask;
