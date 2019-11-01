import React from 'react';
import TaskTable from './task-table';
import AddTask from './add-task';

//Ova komponenta predstavlja glavni pogled koji se prikazuje nakon otvaranja aplikacije.
//Sastoji se od glavne tablice za zadacima i komponente koja se satoji od gumba koji otvara
//modal dijaloški prozor za dodavanje novih zadataka.
function Home(props) {
	return (
		<div>
			<TaskTable tasks={props.tasks}></TaskTable>
			<AddTask addTask={props.addTask}></AddTask>
		</div>
	);
}

export default Home;
