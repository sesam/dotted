var fs = require('fs');
var http = require('http');
const args = require('yargs').argv;
var port = args.port || 5001;
var value = args.value || port;
var counter = args.counter ||  0;
var failcounter = args.failcounter ||  0;

var helpers = require('./helpers');
var indexhtml = fs.readFileSync('index.html', 'utf8');
var indexjs = fs.readFileSync('index.js', 'utf8');

var failhandler = function(res) {
	helpers.html(res, helpers.friendly_page('We are very sorry - something went wrong.',
		'We apologize for the inconvenience.', '\
		Our best engineers are on your case. \
		Please see <a href="https://oc1.statuspage.io/">our statuspage</a> \
		for more details.'), 500);
	counter -= 1;
	failcounter += 1;
}

var arr = function() {
	a = [];
	a.push(value = helpers.next_value(value));
	a.push(value = helpers.next_value(value));
	a.push(value = helpers.next_value(value));
	a.push(value = helpers.next_value(value));
	a.push(value = helpers.next_value(value));
	a.push(value = helpers.next_value(value));
	a.push(value = helpers.next_value(value));
	return a;
}

var handlers = {
	'/':
		(res) => helpers.html(res, indexhtml, null),
	'/index.js':
		(res) => helpers.js(res, indexjs, null),
	'/status':
		(res) => helpers.html(res, 'TODO', null),
	'/data':
		(res) => helpers.json(res, {
			value: value = arr(value),
		}, null),
	'/favicon.ico':
		(res) => helpers.redirect(res, 'https://bitcoinwisdom.com/favicon.ico', 302),
}

var server = http.createServer(function(req, res) {
	console.log(req.url);
	if (handler = handlers[req.url]) {
		handler(res);
		counter += 1;
	} else {
		failhandler(res);
	}
	console.log([counter, failcounter]);
});

server.listen(port);
console.log('0down: serving on port ' + port);
console.log('0down: debug: params ', process.argv);
