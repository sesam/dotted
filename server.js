const args = require('yargs').argv;
var port = args.port || 5001;
var value = args.value || port;
var counter = args.counter ||  0;
var failcounter = args.failcounter ||  0;

var helpers = require('./helpers');
var indexhtml = helpers.read_or_default('index.html', '<marquee>PAGE MISSING</marquee>');
var indexjs = helpers.read_or_default('index.js', 'alert("Try again later")');
var major_version = helpers.read_or_default('.dotted/major_version', '0');

var failhandler = function(res) {
	helpers.html(res,
		helpers.friendly_page('We are very sorry - something went wrong.',
			'We apologize for the inconvenience.', '\
			Our best engineers are on your case. \
			Please see <a href="https://oc1.statuspage.io/">our statuspage</a> \
			for more details.'),
		500);
	counter -= 1;
	failcounter += 1;
}

//
// Create some sample data
//
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

//
// Calculate the next value to client
//
var versioned_next_value = function(req, major_version) {
	return helpers.versioned_json({}, major_version);
}

var favicon_url = 'https://bitcoinwisdom.com/favicon.ico';
var handlers = {
	'/':
		(req, res) => helpers.html(res, indexhtml, null),
	'/index.js':
		(req, res) => helpers.js(res, indexjs, null),
	'/status':
		(req, res) => helpers.html(res, 'TODO', null),
	'/data':
		(req, res) => helpers.json(res, helpers.versioned_json({
			value: value = arr(value),
		}, major_version), null),
	'/next_value':
		(req, res) => helpers.json(res, versioned_next_value(req), null),
	'/favicon.ico':
		(req, res) => helpers.redirect(res, favicon_url, 302),
}

var http = require('http');
var server = http.createServer(function(req, res) {
	// console.log(req.url);
	if (handler = handlers[req.url]) {
		handler(req, res);
		counter += 1;
	} else {
		failhandler(res);
	}
	// console.log([counter, failcounter]);
});

server.listen(port);
console.log('0down: serving on port ' + port);
console.log('0down: debug: params ', process.argv);
