'use strict';

const HOST = process.env['DEMO_HOST'] || 'localhost';
const PORT = process.env['DEMO_PORT'] || 8002;
const ZOOKEEPER_CS = process.env['DEMO_ZOOKEEPER_CS'];

const kafka = require('kafka-node');
const Fs = require('fs');
const Hapi = require('hapi');
const Mustache = require('mustache');
const Path = require('path');
const client = new kafka.Client(ZOOKEEPER_CS);
const consumer = new kafka.Consumer(client, [{ topic: 'click'}]);
const routes = require('./store-route');

var templates = {
	index: Mustache.render(
		Fs.readFileSync(Path.join(__dirname, 'store.html'), {encoding: 'UTF-8'}),
		{ baseUrl: 'http://' + HOST + ':' + PORT }
	)
}

var data = {
	Apples: 1,
	Bananas: 1,
	Oranges: 1,
	Avocados: 1,
	Cherrys: 1,
	Mangos: 1
}

// Create a server with a host and port
const server = Hapi.server({
	host: HOST,
	port: PORT,
	routes: {
		cors: true
	}
});

function getState() {
	return data;
}

// Start the server
async function start() {
	console.log("Start");

	consumer.on('message', function (message) {
		console.log("Consummed message", message);
		data[message.value] += 1;
	});

consumer.on('error', function (err) { console.log('error', err)})

	try {
		await server.register(require('inert'));
		routes.register(server, getState, templates)
		await server.start();
	}
	catch (err) {
		console.log(err);
		process.exit(1);
	}

	console.log('Server running at:', server.info.uri);
};

start();

consumer.on('error', function (err) {
	console.error('Consumer error', err)
})

client.on('error', function (err) {
	console.error('Client error', err)
});
