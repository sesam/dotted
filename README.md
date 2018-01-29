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
. up     # check for performance regressions
. major  # when there's a major update and users should reload
. push   # push to github
. launch # pull from github and launch on a new port
````
