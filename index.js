import http from 'http';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import initializeDb from './db';
import middleware from './middleware';
import api from './api';
import config from './config.json';
const libraryRepo = require('./CRUD.js');
const MongoClient = require('mongodb').MongoClient;

let app = express();
app.server = http.createServer(app);

// logger
app.use(morgan('dev')); // 

// 3rd party middleware
app.use(cors({
	exposedHeaders: config.corsHeaders
}));

app.use(bodyParser.json({
	limit : config.bodyLimit
}));


/* async function main() {
	const url = 'mongodb+srv://am4:MM412Proj@cluster0.olht9.mongodb.net/cscl?retryWrites=true&w=majority'; // localhost url 
    const dbName = 'cscl'; 
	const client = new MongoClient(url); // create new mongo client
	await client.connect();
	
	const getData = await libraryRepo.get();
	console.log(getData)
} */

// connect to db
initializeDb( db => {
	const url = 'mongodb+srv://am4:MM412Proj@cluster0.olht9.mongodb.net/cscl?retryWrites=true&w=majority'; // localhost url 
    const dbName = 'cscl'; 
	// internal middleware
	app.use(middleware({ config, db }));

	// api router
	app.use('/api', api({ config, db }));
	app.get('/', (req, res) => {
		res.send('Library app')
	});
	const client = new MongoClient(url); // create new mongo client
	client.connect();
	
	const getData = libraryRepo.get();
	console.log(getData)

	/* MongoClient.connect('mongodb+srv://am4:MM412Proj@cluster0.olht9.mongodb.net/cscl?retryWrites=true&w=majority', function (err, client) {
        if (err) throw err
      
        var db = client.db('cscl')
	 */
		/* // not available books
        db.collection('books').find({available: 0}).toArray(function (err, result) {
          if (err) throw err
      
          console.log(result)
		})
		
		// available books
		db.collection('books').find({available: {$gt: 0}}).toArray(function (err, result) {
			if (err) throw err
		
			console.log(result)
		  }) 
	  })*/


	app.server.listen(process.env.PORT || config.port, () => {
		console.log(`Started on port ${app.server.address().port}`);
	});

	
});

export default app;
