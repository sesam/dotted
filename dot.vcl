vcl 4.0;

backend n1 { .host = "127.0.0.1"; .port ="5001"; .probe = { .url = "/status"; .interval = 5s; .timeout = 1s; .window = 5;.threshold = 3; }}
backend n2 { .host = "127.0.0.1"; .port ="5002"; .probe = { .url = "/status"; .interval = 5s; .timeout = 1s; .window = 5;.threshold = 3; }}
backend n3 { .host = "127.0.0.1"; .port ="5003"; .probe = { .url = "/status"; .interval = 5s; .timeout = 1s; .window = 5;.threshold = 3; }}
backend n4 { .host = "127.0.0.1"; .port ="5004"; .probe = { .url = "/status"; .interval = 5s; .timeout = 1s; .window = 5;.threshold = 3; }}
backend n5 { .host = "127.0.0.1"; .port ="5005"; .probe = { .url = "/status"; .interval = 5s; .timeout = 1s; .window = 5;.threshold = 3; }}
backend n6 { .host = "127.0.0.1"; .port ="5006"; .probe = { .url = "/status"; .interval = 5s; .timeout = 1s; .window = 5;.threshold = 3; }}
backend n7 { .host = "127.0.0.1"; .port ="5007"; .probe = { .url = "/status"; .interval = 5s; .timeout = 1s; .window = 5;.threshold = 3; }}
backend n8 { .host = "127.0.0.1"; .port ="5008"; .probe = { .url = "/status"; .interval = 5s; .timeout = 1s; .window = 5;.threshold = 3; }}

import directors;

sub vcl_init {
	new vdir = directors.round_robin();
	vdir.add_backend(n1);
	vdir.add_backend(n2);
	vdir.add_backend(n3);
	vdir.add_backend(n4);
	vdir.add_backend(n5);
	vdir.add_backend(n6);
	vdir.add_backend(n7);
	vdir.add_backend(n8);
}

sub vcl_recv {
  # Respond to incoming requests.
  set req.backend_hint = vdir.backend();

	if (req.url ~ "^/(cron|install|robots|humans)") {
		# crawlers bye bye
		# error 404 "Page not found.";
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

	# don't let ?2379428734 -versioned files mess up. We have caching headers
	if (req.url ~ "(?i)\.(png|gif|jpeg|jpg|ico|swf|css|js|html|htm)(\?[a-z0-9]+)?$") {
		unset req.http.Cookie;
	}
}
