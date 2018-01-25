// helpers

module.exports = {
	html: function(res, string, status) {
		res.writeHead(status || 200, {
			'Content-Type': 'text/html'
		});
		res.write('<html><body><p>' + string + '</p></body></html>');
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
