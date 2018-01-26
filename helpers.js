// helpers

module.exports = {
	//
	// Return a javascript document
	//
	js: function(res, string, status) {
		res.writeHead(status || 200, {
			'Content-Type': 'application/javascript'
		});
		res.write(string);
		res.end();
	},

	//
	// Return a html document
	//
	html: function(res, string, status) {
		res.writeHead(status || 200, {
			'Content-Type': 'text/html'
		});
		res.write(string);
		res.end();
	},

	//
	// Redirect the browser
	//
	redirect: function(res, url, status) {
		res.writeHead(status || 302, {
			'Location': url,
			'Content-Type': 'text/html',
		});
		res.write('Moved permanently');
		res.end();
	},

	//
	// Get the next value, calculated from the previous one
	//
	next_value: (value) => value + Math.floor(2 * Math.random()) - 1,
	// next_value: function(value) { return value + Math.floor(2 * Math.random()) - 1 },

	//
	// Read a file, or if missing, return a default value
	//
	read_or_default: function(path, fallback) {
		var fs = require('fs');
		if (fs.existsSync(path)) {
			return fs.readFileSync(path, 'utf8');
		} else return fallback;
	},

	//
	// Create a HTML document with headlines
	// The friendly background color is supposedly liked by both men and women
	//
	friendly_page: function(subject, tagline, content) {
		style = 'background:#7fdba3; zoom: 2; margin:3em; font-family:roboto,arial;';
		return '<body style="' + style + '"><h3>' +
			subject + '</h3><h4>' + tagline + '</h4>' + content + '</body>';
	},

	//
	// Return a JSON document
	//
	json: function(res, structure, status, mimetype) {
		mime = mimetype ||  'application/json';
		res.writeHead(status ||  200, {
			'Content-Type': mime
		});
		res.write(JSON.stringify(structure));
		res.end();
	},
}
