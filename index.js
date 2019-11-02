require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');

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

		//Ruta za dohvaćanje pojedinog zadatka ovisno o poslanom id-u.
		//Koristi se kod detaljnog prikaza zadatka.
		app.get('/get-task', async (req, res, next) => {
			const id = req.query.id;
			const result = await tasks.findOne({ _id: parseInt(id) });
			res.json(result);
		});

		//Ruta za zapisivanje novog zadatka.
		app.post('/post-task', async (req, res, next) => {
			//Radi preglednosti, aplikacija, umjesto ObjectId vrijednosti,
			//koristi int vrijednosti za id atribut zadatka.
			//Ovdje se prvo pronalazi najveći postojeći id u bazi.
			//Nakon toga se ta vrijednost inkrementira i
			//postaje id vrijednost novog zapisa.
			//Iskreno, ne znam zašto sam to ovako učinio.
			//Znam da to definitivno, apsolutno nije dobra praksa,
			//ali mi se nije svidjelo da u tablici bude random string koji
			//predstavlja id zadatka.
			const newestTask = await tasks
				.find({})
				.sort({ _id: -1 })
				.limit(1)
				.toArray();

			//Izračun ID-a novog dokumenta
			const newId = newestTask.length === 0 ? 1 : newestTask[0]._id + 1;

			//Trenutno vrijeme u Unix timestamp obliku.
			const date = Date.now();

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
		app.post('/update-task', async (req, res, next) => {
			//Ovjde se prima id zadatka, radi njegovo pronalaženja
			//i novi tekst i naslov zadatka za ažuriranje.
			taskId = req.body.id;
			taskTitle = req.body.title;
			taskDescription = req.body.description;

			const result = await tasks.updateOne(
				{ _id: taskId },
				{ $set: { title: taskTitle, description: taskDescription } }
			);

			if (result.modifiedCount === 1) {
				res.json('ok');
			} else {
				res.json('error');
			}
		});

		//Ruta za brisanje zadataka.
		app.post('/delete-tasks', async (req, res, next) => {
			//Ovdje se prima array zadataka, no to ne isključuje
			//mogućnost da se u array-u nalazi samo jedan zadatak.
			const tasksToDelete = req.body.tasks;
			const taskIds = tasksToDelete.map(task => task._id);
			const result = await tasks.deleteMany({ _id: { $in: taskIds } });
			if (result.result.ok === 1) {
				res.json('ok');
			} else {
				res.json('error');
			}
		});
	})
	.catch(error => {
		console.error(error.message);
	});

//Pokretanje servera.
let port = 5000;
app.listen(port, () => console.log(`Listening on port ${port}.`));
