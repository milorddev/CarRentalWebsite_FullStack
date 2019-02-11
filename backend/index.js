/*jshint esversion: 6 */
const express = require('express');
const path = require('path');
var bodyParser = require("body-parser");
const crypto = require('crypto');
const cors = require('cors');

const db = require(path.join(__dirname, '/database.js'));

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.get('/', (req, res) => {
	res.send('Hello World!');
});


app.get('/getReservationsByCar', (req,res) => {
	db.reserved.findAll({
		where: {
			carID: req.query.carID
		}
	}).then(times => {
		res.send({data: times});
	});
});

app.post('/reserve', (req,res) => {
	db.reserved.create(req.body).then(success => {
		res.send({text: 'car reserved'});
	}).catch(err => {
		res.send({error: err});
	});
});

app.post('/car/createListing', (req,res) => {
	db.cars.create(req.body).then(success => {
		res.send({text: 'car listing made'});
	}).catch(err => {
		res.send({error: err});
	});
});

//get the car listings
app.get('/cars', (req,res) => {
	db.cars.findAll().then(cars => {
		res.send({data: cars});
	});
});

//send over the image for the car
app.get('/car/images', (req,res) => {
	var imagepath = path.join(__dirname, `/images/${req.query.imageName}.jpg`);
	res.sendFile(imagepath);
});

app.listen(port, () => {
	db.authenticate();
	db.sync(false);
	console.log(`Example app listening on port ${port}!`);
});