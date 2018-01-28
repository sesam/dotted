backend n1 { .host = "127.0.0.1"; .port 5001; .probe = { .url = "/status"; .interval = 5s; .timeout = 1s; .window = 5;.threshold = 3; }}
backend n2 { .host = "127.0.0.1"; .port 5002; .probe = { .url = "/status"; .interval = 5s; .timeout = 1s; .window = 5;.threshold = 3; }}
backend n3 { .host = "127.0.0.1"; .port 5003; .probe = { .url = "/status"; .interval = 5s; .timeout = 1s; .window = 5;.threshold = 3; }}
backend n4 { .host = "127.0.0.1"; .port 5004; .probe = { .url = "/status"; .interval = 5s; .timeout = 1s; .window = 5;.threshold = 3; }}
backend n5 { .host = "127.0.0.1"; .port 5005; .probe = { .url = "/status"; .interval = 5s; .timeout = 1s; .window = 5;.threshold = 3; }}
backend n6 { .host = "127.0.0.1"; .port 5006; .probe = { .url = "/status"; .interval = 5s; .timeout = 1s; .window = 5;.threshold = 3; }}
backend n7 { .host = "127.0.0.1"; .port 5007; .probe = { .url = "/status"; .interval = 5s; .timeout = 1s; .window = 5;.threshold = 3; }}
backend n8 { .host = "127.0.0.1"; .port 5008; .probe = { .url = "/status"; .interval = 5s; .timeout = 1s; .window = 5;.threshold = 3; }}

director default_director round-robin {
  { .backend = n1; }
	{ .backend = n2; }
	{ .backend = n3; }
	{ .backend = n4; }
	{ .backend = n5; }
	{ .backend = n6; }
	{ .backend = n7; }
	{ .backend = n8; }
}

# Respond to incoming requests.
sub vcl_recv {
	# Set the director to cycle between web servers.
	set req.backend = default_director;
}

if (req.url ~ "^/(cron|install|robots|humans|)" {
	# crawlers bye bye
	error 404 "Page not found.";
}

# Simplify encoding choices to allow for efficient caching
if (req.http.Accept-Encoding) {
	# in order of priority
	if (req.http.Accept-Encoding ~ "gzip") {
		set req.http.Accept-Encoding = "gzip";
	} else if (req.http.Accept-Encoding ~ "deflate") {
		set req.http.Accept-Encoding = "deflate";
	}	else {
		unset req.http.Accept-Encoding;
	}
}

# don't let ?2379428734 -versioned files confuse. We have caching headers
if (req.url ~ "(?i)\.(png|gif|jpeg|jpg|ico|swf|css|js|html|htm)(\?[a-z0-9]+)?$") {
	unset req.http.Cookie;
}

sub vcl_error {
	# on error, show statuspage
	if (req.url ~ "^/?$") {
		set obj.status = 302;
		set obj.http.Location = "https://oc1.statuspage.io/";
	}
}
