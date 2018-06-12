'use strict';

module.exports.register = function(server, producer, templates) {
	// Add the route
	server.route({
		method: 'POST',
		path: '/click/{thing}',
		handler: function(request, h) {
			console.log('+ ' + request.params.thing);
			producer.send([{ topic: 'click', messages: request.params.thing}], function (err, data) {
				if (err) {
					console.log("send error", data, err);
				}
			});

			return request.params.thing +', got it!';
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
