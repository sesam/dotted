// helpers
var fs = require('fs');

module.exports = {
	//
	// save port numbers
	//
	save_ports: function(path, port, next_port) {
		fs.writeFile(path + "/port", port, function(err) {
			if(err) { console.log(err); }
			console.log("saved %s in %s/port", port, path);
		});
		fs.writeFile(path + "/next_port", next_port, function(err) {
			if(err) { console.log(err); }
			console.log("saved %s in %s/next_port", next_port, path);
		});
	},

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
	versioned_json: function(content, current, deployed, target) {
		content.dotted = {
			major: current.major,
			tag: current.tag,
			deployed_tag: deployed.tag,
			migrate: current.major < target.major,
		};
		return content;
	},
}
