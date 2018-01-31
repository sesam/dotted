## Dotted

__Dotted is a new toolkit for deploying web apps over ssh to a web host.__

The focus is on keeping it simple, and keeping the options open to make sure
the migration from one version to the next can happen in an orderly manner.
The inspiration is the "Upgrade now / Ask me tomorrow" type of question that
we see more and more of.

The user, of course, would be much more certain about upgrading if there would
be some information about who / how many have already upgraded. Maybe also a
guarantee that it's possible to take the upgrade for a test run and maybe keep
all the users's data available on both sides. Banks often have multi-year long
upgrade processes while letting the customer choose. Google is trying, after
having had very bad results from forcing their developers.google.com console
upgrade onto people before it was even finished or fully usable.

### Goals

 - Let users stay on their version as long as their session is open.
 - Let minor backend upgrades and important bugfixes to happen silently
 - Let the user upgrade voluntarily
 - All new sessions get the newest deployed code
 - Keep things very cacheable

### Usage

After git cloning dotted, try `cd dotted; . home` in the terminal. Trust, but verify!

````
. help   # Lists all the Dotted commands:
. up     # check performance and push
. major  # when there's a major update and users should reload
. launch # pull from github and launch on a new port
````

### Dotted's JSON structure

__Partly implemented__

JSON responses should include these keys:
````
'dotted':
  'major': major version based on date and time as a long integer (sortable)
  'tag': sha1 (from git) of the code
  'migrate': false, or an address:port where the client's session migrates to
  'status_message': user-friendly server status message
  'status_detail': where the uptime-page for this service is located
````

A basic setup script to install "dotted" into a VM can be launched with:

````
curl -L goo.gl/u8dCzH|bash
````

And after that, cd into the folder `dotted` to have these __folder local__
commands available:

````
. help   # lists all the Dotted commands
. up     # check for performance regressions
. major  # when there's a major update and users should reload
. push   # push to github
. launch # pull from github and launch on a new port
````

The full train of thoughts is in the [JOURNAL text](JOURNAL.txt)

### TODOs

The live ticker and chart gets data from /data asynch and responses might come
in out of order.

- check that Highcharts handles out of order data nicely
- avoid updating ticker box from newer to older data
