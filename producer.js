'use strict';

const HOST = process.env['DEMO_HOST'] || 'localhost';
const PORT = process.env['DEMO_PORT'] || 8001;
const ZOOKEEPER_CS = process.env['DEMO_ZOOKEEPER_CS'];

const Fs = require('fs');
const Hapi = require('hapi');
const Kafka = require('kafka-node');
const Mustache = require('mustache');
const Path = require('path');
const routes = require('./producer-route');

const client = new Kafka.Client(ZOOKEEPER_CS);
const producer = new Kafka.Producer(client);

var templates = {
	index: Mustache.render(
		Fs.readFileSync(Path.join(__dirname, 'producer.html'), {encoding: 'UTF-8'}),
		{ baseUrl: 'http://' + HOST + ':' + PORT }
	)
}

// Create a server with a host and port
const server = Hapi.server({
	host: HOST,
	port: PORT,
	routes: {
		cors: true,
		files: {
			relativeTo: __dirname
		}
	}
});

// Start the server
async function start() {

	console.log("create topic");
	client.createTopics(['click'], function (err, data) {
		console.log("Create topic", err, data)
	});

	try {
		await server.register(require('inert'));
		routes.register(server, producer, templates)
		await server.start();
	}
	catch (err) {
		console.log(err);
		process.exit(1);
	}

	console.log('Server running at:', server.info.uri);
};

producer.on('ready', function () {
	start();
});

producer.on('error', function (err) {
	console.error('Producer error', err)
})

client.on('error', function (err) {
	console.error('Client error', err)
});

client.on('ready', function (err, data) {
	console.error('Client ready', err, data)
});

client.once('connect', function () {
	client.loadMetadataForTopics([], function (error, results) {
	  if (error) {
	  	return console.error(error);
	  }
	  console.log(results);
	});
});
