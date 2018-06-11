'use strict';

module.exports.register = function(server, producer, templates) {
	// Add the route
	server.route({
		method: 'POST',
		path: '/click/{thing}',
		handler: function(request, h) {
			console.log('+ ' + request.params.thing);
			producer.send([{ topic: 'click', thing: request.params.thing}], function (err, data) {
				console.log(data, err);
			});

			return 'hello world - ' + request.params.thing;
		}
	});

	// Add the route
	server.route({
		method: 'GET',
		path: '/',
		handler: function(request, h) {
			return templates['index']
		}
	});

	server.route({
		method: 'GET',
		path: '/public/{param}',
		handler: {
			directory: {
				path: 'public',
				listing: true
			}
		}
	});
}
