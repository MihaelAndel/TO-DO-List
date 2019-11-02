import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import Axios from 'axios';

//Slična situacija kao i kod komponente za dodavanje novog zadatka.
function EditModal(props) {
	const [show, setShow] = useState(false);
	const [taskTitle, setTitle] = useState(props.task.title);
	const [taskDescription, setDescription] = useState(props.task.description);

	const hideModal = () => setShow(false);

	const showModal = () => {
		setTitle(props.task.title);
		setDescription(props.task.description);
		setShow(true);
	};

	const editTask = async event => {
		event.preventDefault();
		console.log('tu sam');
		const form = event.currentTarget;
		if (form.checkValidity() === false) {
			event.stopPropagation();
			return;
		}

		try {
			const response = await Axios.post('/update-task', {
				id: props.task._id,
				title: taskTitle,
				description: taskDescription
			});
			var data = response.data;
		} catch (e) {
			console.error('Error while sending data to server, try again.');
		}
		//Ako je sve u redu s ažuriranjem u bazi, stvori novi zadatak i zamijeni ga s postojećim u stanju.
		if (data === 'ok') {
			let task = props.task;
			task.title = taskTitle;
			task.description = taskDescription;

			props.editTask(task);
			hideModal();
		}
	};

	return (
		<div>
			<Button onClick={showModal} variant="outline-info">
				&#9998;
			</Button>
			<Modal show={show} onHide={hideModal}>
				<Modal.Header closeButton>
					<Modal.Title>Edit selected task</Modal.Title>
				</Modal.Header>

				<Form validated onSubmit={editTask}>
					<Modal.Body>
						<Form.Label>Title</Form.Label>
						<Form.Control
							required
							value={taskTitle}
							onChange={e => {
								setTitle(e.target.value);
							}}></Form.Control>
						<Form.Label>Description</Form.Label>
						<Form.Control
							required
							value={taskDescription}
							onChange={e => {
								setDescription(e.target.value);
							}}></Form.Control>
					</Modal.Body>

					<Modal.Footer>
						<Button onClick={hideModal} variant="secondary">
							Close
						</Button>
						<Button type="submit" variant="primary">
							Submit edit
						</Button>
					</Modal.Footer>
				</Form>
			</Modal>
		</div>
	);
}

export default EditModal;
