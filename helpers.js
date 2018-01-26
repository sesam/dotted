// helpers
const { exec } = require('child_process');

module.exports = {
	//
	// Return a javascript document
	//
	js: function(res, string) {
		res.writeHead(200, {
			'Content-Type': 'application/javascript'
		});
		res.write(string);
		res.end();
	},

	//
	// Return a html document
	//
	html: function(res, string) {
		res.writeHead(200, {
			'Content-Type': 'text/html'
		});
		res.write(string);
		res.end();
	},

	//
	// Redirect the browser
	//
	redirect: function(res, url) {
		res.writeHead(302, {
			'Location': url,
			'Content-Type': 'text/html',
		});
		res.write('Moved');
		res.end();
	},

	//
	// Get the next value, calculated from the previous one
	//
	next_value: (value) => value + Math.round(2 * Math.random() - 1.0),
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
	// Checkout from git and overwrite
	//
	hard_checkout: function() {
		var cmd = 'git fetch; git checkout --hard master';
		exec(cmd, (err, stdout, stderr) => {
		  return stdout + stderr + err;
		});
	},

	//
	// Start serving on a port
	//
	spawn: function(port) {
		var cmd = 'node --port ' + port + ' server.js';
		exec(cmd, (err, stdout, stderr) => {
		  return stdout + stderr + err;
		});
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
	json: function(res, structure) {
		res.writeHead(200, {
			'Content-Type': 'application/json'
		});
		res.write(JSON.stringify(structure));
		res.end();
	},

	//
	// Adds versioning and status needed by a dotted client/server system
	//
	versioned_json: function(content, major_version) {
		content['.dotted'] = {
			'major_version': major_version,
			// 'sha1': 'missing',
			'migrate': false,
			'status_message': 'ok',
			'status_detail': '',
		};
		return content;
	},
}
