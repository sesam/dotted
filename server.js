var http = require('http');
const args = require('yargs').argv;
var port = args.port || 5001;
var value = args.value || port;

var html = function(res, string, status) {
	res.writeHead(status || 200, {
		'Content-Type': 'text/html'
	});
	res.write('<html><body><p>' + string + '</p></body></html>');
	res.end();
}

var friendly_page = function(subject, tagline, content) {
	style = 'background:#7fdba3; zoom: 2; margin:3em; font-family:roboto,arial;';
	'<body style="' + style + '"> \
	<h3>' + subject + '</h3><h4>' + tagline + '</h4>' + content + '</body>';
}

var json = function(res, structure, status, mimetype) {
	mime = mimetype ||  'application/json';
	res.writeHead(status ||  200, {
		'Content-Type': mime
	});
	res.write(JSON.stringify(structure));
	res.end();
}

var status = [];
var counter = args.counter ||  0;
var failcounter = args.failcounter ||  0;
var server = http.createServer(function(req, res) {
	switch (res.url) {
		case '/':
			html(res, 'All ur base.', null);
			break;
		case '/status':
			html(res, '', null);
			break;
		case '/data':
			json(res, {
				message: 'Hej'
			}, null);
			break;
		default:
			html(res, friendly_page('We are very sorry - something went wrong.',
				'We apologize for the inconvenience.', '\
				Our best engineers are on your case. \
				Please see <a href="https://oc1.statuspage.io/">our statuspage</a> \
				for more details.'), 500);
			counter -= 1;
			failcounter += 1;
	}
	counter += 1;
});

server.listen(port);
console.log('0down: serving on port ' + port);

console.log('0down: debug: params ', process.argv);
