import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import Axios from 'axios';

//Komponenta koja se, poput EditModal komponente, sastoji od gumba i modal prozora.
//Komponenta prima array označenih zadataka, ili, u slučaju da se briše zadatak
//preko detaljnog prikaza zadatka, array sa samo jednim zadatkom.

function DeleteModal(props) {
	const [show, setShow] = useState(false);

	const showModal = () => setShow(true);
	const closeModal = () => setShow(false);

	const deleteTasks = async event => {
		event.preventDefault();
		const response = await Axios.post('/delete-tasks', {
			tasks: props.tasks
		});
		if (response.data === 'ok') {
			props.deleteTasks();
			closeModal();
			props.callback();
		}
	};
	if (props.tasks.length > 0) {
		return (
			<div>
				<Button onClick={showModal} variant="danger" className="delete-button">
					&#128465;
				</Button>
				<Modal onHide={closeModal} show={show}>
					<Modal.Header closeButton>
						<Modal.Title>Are you sure you want to delete the selected tasks?</Modal.Title>
					</Modal.Header>
					<Form onSubmit={deleteTasks}>
						<Modal.Footer>
							<Button onClick={closeModal} variant="secondary">
								Close
							</Button>
							<Button type="submit" variant="danger">
								Delete
							</Button>
						</Modal.Footer>
					</Form>
				</Modal>
			</div>
		);
	} else {
		return null;
	}
}

export default DeleteModal;
