var http = require('http');
const args = require('yargs').argv;
var helpers = require('./helpers');
var port = parseInt(args.port || helpers.read_or_default('.dotted/port', 5001));
var next_port = (port) => 5001 + (port - 5000) % 12;
var ip = '127.0.0.1';
var value = args.value || 1000 * Math.random();
var counter = args.counter ||  0;
var failcounter = args.failcounter ||  0;

var indexhtml = helpers.read_or_default('index.html', '<marquee>PAGE MISSING</marquee>');
var indexjs = helpers.read_or_default('js/index.js', 'alert("Try again later")');

//
// Version tracking
//
var dotted = () => ({
	major: helpers.read_or_default('.dotted/major_version', null),
	tag: helpers.read_or_default('.dotted/tracking_tag', null),
	port: helpers.read_or_default('.dotted/port', '0'),
	next_port: helpers.read_or_default('.dotted/next_port', '0'),
});
var current = dotted();
var deployed = current;
var target = current;
var redeployed = () => ({ running: current, last: deployed = dotted(check_target()) });
function take_target(res) {
	res.setEncoding('utf8');
	let body = '';
	res.on('data', (data) => (body += data));
	res.on('end', () => {
		console.log(body);
		if (res.statusCode > 400) { console.log('HTTP code ' + res.statusCode); return; }
		// todo: use params from response
		js = JSON.parse(body);
		target = Object.assign({}, deployed); // probably exactly what we want
		target.port = js.port; // overwrite to be sure. todo: verify and log any "can't happen" events
		target.major = js.major;
		target.tag = js.tag;
	});
}
function check_target() {
	if (current.tag != deployed.tag) console.log('app change detected');
	if (current.major >= deployed.major) console.log('not a major update');
	else console.log('*** major update ***');

	console.log(JSON.stringify(deployed) + ' vs \n' + JSON.stringify(current));
	console.log('checking deploy ' + JSON.stringify(deployed));
	// give ticker value so new instance can get started with a fallback (time, value)
	var post_data = value + '\n' + (new Date()).valueOf();
	var post_options = {
	      host: ip,
	      port: deployed.port,
	      path: '/status',
	      method: 'POST',
	      headers: {
	          'Content-Type': 'text/text',
	          'Content-Length': Buffer.byteLength(post_data)
	      }
	  };
	var req = http.request(post_options, take_target);
	req.end(post_data);
	req.on('socket', (socket) => {
		socket.setTimeout(800);
		socket.on('timeout', () => req.abort());
	});
	req.on('error', function(err) {
		console.log('0down: check_target error - retrying in 500 ' + err.code);
		if (current.major >= deployed.major) setTimeout(check_target, 500);
	});
}

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
// Calculate the next value to client
//
var versioned = (req) => helpers.versioned_json({
	value: helpers.next_value(value),
	time: new Date(),
}, current, deployed, target);

var favicon_url = 'https://bitcoinwisdom.com/favicon.ico';
var handlers = {
	'/':
		(req, res) => helpers.html(res, indexhtml),
	'/offline.html':
		(req, res) => helpers.html(res, offlinehtml),
	'/js/index.js':
		(req, res) => helpers.js(res, indexjs, false),
	'/upup.min.js':
		(req, res) => helpers.js(res, upupjs, false),
	'/upup.sw.min.js':
		(req, res) => helpers.js(res, upupswjs, false),
	'/status':
		(req, res) => helpers.js(res, [current, deployed, target], true),
	'/deployed':
		(req, res) => helpers.js(res, redeployed(), true),
	'/data':
		(req, res) => helpers.js(res, versioned(req), true),
	'/favicon.ico':
		(req, res) => helpers.redirect(res, favicon_url),
}

// start http server
var server = http.createServer(function(req, res) {
	if (handler = handlers[req.url]) {
		handler(req, res);
		counter += 1;
	} else {
		failhandler(res);
	}
});
server.on('listening', () => {
	console.log('0down: serving on port ' + port);
	helpers.save_ports('.dotted', port, next_port(port));
});
var last_port_retry = port;
server.on('error', (err) => {
	console.log('error: ' + err);
	port = next_port(port);
	if (port == last_port_retry) {
		console.log('no ports free after trying the whole range from ' + last_port_retry + ' through the whole range');
	} else {
		console.log('binding port failed, so try next port = ' + port);
		start_server();
	}
});
function start_server() {
	console.log('trying to listen on ' + port);
	server.listen(port, '0.0.0.0');
}
var timeout = 5 * (1 + 0.5 * Math.random());
console.log('0down: waiting ' + Math.round(timeout, 1) + 's -- params ', process.argv);
setTimeout(start_server, timeout * 1000.0);
