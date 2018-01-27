const args = require('yargs').argv;
var port = args.port || 5001;
var next_port = 5001 + (port - 5000) % 998;
var value = args.value || 1000 * Math.random();
var counter = args.counter ||  0;
var failcounter = args.failcounter ||  0;

var helpers = require('./helpers');
helpers.save_ports('.dotted', port, next_port);
var indexhtml = helpers.read_or_default('index.html', '<marquee>PAGE MISSING</marquee>');
var indexjs = helpers.read_or_default('js/index.js', 'alert("Try again later")');
var dotted = () => ({
	major: helpers.read_or_default('.dotted/major_version', null),
	tag: helpers.read_or_default('.dotted/tracking_tag', null),
	port: helpers.read_or_default('.dotted/port', '0'),
	next_port: helpers.read_or_default('.dotted/next_port', '0'),
});
var current = dotted();
var deployed = current;
var target = current;
var redeployed = () => ({ running: current, last: deployed = dotted() });

// Not serverless yet - so failures and some offline support for better looks
var offlinehtml = helpers.read_or_default('offline.html', '<marquee>PAGE MISSING</marquee>');
var upupjs = helpers.read_or_default('js/upup.min.js', 'missing upup.min.js');
var upupswjs = helpers.read_or_default('js/upup.sw.min.js', 'missing upup.min.js');
var failhandler = function(res) {
	helpers.html(res,
		helpers.friendly_page('We are very sorry - something went wrong.',
			'We apologize for the inconvenience.', '\
			Our best engineers are on your case. \
			Please see <a href="https://oc1.statuspage.io/">our statuspage</a> \
			for more details.'),
		500);
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
var versioned = (req) => helpers.versioned_json({
	value: helpers.next_value(value)
}, current, deployed, target);

var favicon_url = 'https://bitcoinwisdom.com/favicon.ico';
var handlers = {
	'/':
		(req, res) => helpers.html(res, indexhtml),
	'/offline.html':
		(req, res) => helpers.html(res, offlinehtml),
	'/index.js':
		(req, res) => helpers.js(res, indexjs),
	'/upup.min.js':
		(req, res) => helpers.js(res, upupjs),
	'/upup.sw.min.js':
		(req, res) => helpers.js(res, upupswjs),
	'/status':
		(req, res) => helpers.json(res, current),
	'/deployed':
		(req, res) => helpers.json(res, redeployed()),
	'/data':
		(req, res) => helpers.json(res, versioned(req)),
	'/favicon.ico':
		(req, res) => helpers.redirect(res, favicon_url),
}

var http = require('http');
var server = http.createServer(function(req, res) {
	if (handler = handlers[req.url]) {
		handler(req, res);
		counter += 1;
	} else {
		failhandler(res);
	}
});

var timeout = 5000/3.0 * (3.0 + Math.random());
console.log('0down: waiting ' + Math.round(timeout/1000.0, 2) + 's -- params ', process.argv);
setTimeout(function() {
	server.listen(port);
	console.log('0down: serving on port ' + port);
}, timeout);
