require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const moment = require('moment');

app.use(cors());
app.use(bodyParser());

//Stvaranje objekta koji predstavlja jedan MongoDB klijent koji se može spojiti na bazu.
//Connection string spremljen je u .env datoteci.
const client = new MongoClient(process.env.DB_CONN, {
	useUnifiedTopology: true,
	useNewUrlParser: true
});

//Aplikacija se samo jednom spaja na bazu.
//Budući da se radi o malom projektu koji nikad neće imati puno konekcija (niti puno upita),
//ovakav način komunikacije s bazom je prihvatljiv.
client
	.connect()
	.then(async () => {
		//Referenciranje kolekcije iz baze podataka.
		var tasks = client.db('TODO-List').collection('Tasks');

		//Ruta za dohvaćanje svih zadataka.
		app.get('/get-all-tasks', async (req, res, next) => {
			let allTasks = await tasks.find({}).toArray();
			res.json(allTasks);
		});

		//Ruta za zapisivanje novog zadatka.
		app.post('/post-task', async (req, res, next) => {
			const newestTask = await tasks
				.find({})
				.sort({ _id: -1 })
				.limit(1)
				.toArray();

			//Izračun ID-a novog dokumenta
			const newId = newestTask.length === 0 ? 1 : newestTask[0]._id + 1;

			//Moment.js biblioteka koristi se radi laganog formatiranja datuma i vremena.
			const date = moment().format('MMMM Do YYYY, h:mm:ss a');

			const newTask = {
				_id: newId,
				title: req.body.title,
				description: req.body.description,
				dateCreated: date
			};

			const insert = await tasks.insertOne(newTask);

			//Ako je dodan jedan dokument, vrati poruku 'ok', vrijeme kreiranja i novi ID.
			//U suprotnom vrati poruku 'error'.
			if (insert.insertedCount === 1) {
				res.json({
					message: 'ok',
					id: newId,
					created: date
				});
			} else {
				res.json('error');
			}
		});

		//Ruta za ažuriranje postojećeg zadatka.
		app.post('/update-task', async (req, res, next) => {});

		//Ruta za brisanje zadataka.
		app.post('/delete-task', async (req, res, next) => {});
	})
	.catch(error => {
		console.error(error.message);
	});

//Pokretanje servera.
let port = 5000;
app.listen(port, () => console.log(`Listening on port ${port}.`));
