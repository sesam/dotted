// helpers

module.exports = {
	js: function(res, string, status) {
		res.writeHead(status || 200, {
			'Content-Type': 'application/javascript'
		});
		res.write(string);
		res.end();
	},

	html: function(res, string, status) {
		res.writeHead(status || 200, {
			'Content-Type': 'text/html'
		});
		res.write(string);
		res.end();
	},

	redirect: function(res, url, status) {
		res.writeHead(status || 302, {
			'Location': url,
			'Content-Type': 'text/html',
		});
		res.write('Moved permanently');
		res.end();
	},

	next_value: (value) => value + Math.floor(2 * Math.random()) - 1,
	// next_value: function(value) { return value + Math.floor(2 * Math.random()) - 1 },

	friendly_page: function(subject, tagline, content) {
		style = 'background:#7fdba3; zoom: 2; margin:3em; font-family:roboto,arial;';
		return '<body style="' + style + '"><h3>' +
			subject + '</h3><h4>' + tagline + '</h4>' + content + '</body>';
	},

	json: function(res, structure, status, mimetype) {
		mime = mimetype ||  'application/json';
		res.writeHead(status ||  200, {
			'Content-Type': mime
		});
		res.write(JSON.stringify(structure));
		res.end();
	},
}
