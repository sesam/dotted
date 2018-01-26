from datetime import datetime as dt_
from subprocess import check_output
import re
import os
sinkhole = open(os.devnull, 'w')

#
# Reads a timestamp YYYYMMDDHHMMSS, or defaults to all zeroes
#
def read_14(path):
    try:
        return open(path, "r").read(14)
    except IOError:
        return '0' * 14

#
# Delete a file silently
#
def silentremove(path):
    if os.path.isfile(path): os.remove(path)

#
# Git tag and push with overwrite
# servers tracks itself what it runs, and we're free keep git history clean
#
def git_tag_and_push():
    cmd = 'git tag dotted-%s' % timestamp()
    check_output(cmd.split())
    cmd = 'git push origin --force'
    check_output(cmd.split())

#
# Get a git reference that uniquely identifies the current code
#
def gitref():
    cmd = 'git describe --always --dirty'
    return check_output(cmd.split()).rstrip('\n')

#
# Get a timestamp string formatted like YYYYMMDDHHMMSS
#
def timestamp():
    return dt_.now().strftime('%Y%m%d%H%M%S')

#
# Track major version upgrades, meant to invite or force a full client reload
#
def update_major(ver_path, log_path):
    ver = timestamp()
    old = read_14(ver_path)
    print 'Updating major version from ' + old + ' to ' + ver
    open(ver_path, "w").write(ver)
    try:
        check_output(['git', 'add', ver_path, log_path])
        check_output(['git', 'commit', '-m', 'major ' + old + ' to ' + ver])
    except:
        print "\nMissing version or benchmarks. \nRun . up and try again.\n"

#
# Collect benchmarks
#
def hammer(urls):
    marks = []
    rps_re = re.compile(r"Requests per second: *(\d+)")
    for url in urls:
        cmd = ['ab', '-n', '2000', '-c', '100', '-k', url]
        output = check_output(cmd, stderr = sinkhole)
        rps = rps_re.search(output).group(1)
        marks.append(rps)
    return marks
