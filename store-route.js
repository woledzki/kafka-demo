'use strict';

module.exports.register = function(server, getState, templates) {
	server.route({
		method: 'GET',
		path: '/data',
		handler: function(request, h) {
			var state = getState();
			var d3Data = [];
			Object.keys(state).forEach((key) => {
				d3Data.push({ label: key, value: state[key] });
			});

			return d3Data;
		}
	});

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
