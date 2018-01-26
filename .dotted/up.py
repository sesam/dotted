from sys import argv
from datetime import datetime as dt
from subprocess import check_output
from os import devnull
# import const
import re
VERSION_PATH = ".dotted/major_version"
# const.version_path = VERSION_PATH
# TRACKING_TAG_PATH = ".dotted/tracking_tag"
BENCH_LOG = ".dotted/bench.log"
BENCH_URLS = [
    'http://localhost:5001/',
    'http://localhost:5001/data',
]
sinkhole = open(devnull, 'w')

def read_ver():
    try:
        return open(VERSION_PATH, "r").read(14)
    except IOError:
        return '0' * 14

def gitref(branch):
    # cmd = 'git rev-parse --verify HEAD'.split()
    cmd = 'git describe --always --dirty'.split()
    return check_output(cmd)

def hammer(urls):
    marks = []
    rps_re = re.compile(r"Requests per second: *(\d+)")
    for url in BENCH_URLS:
        cmd = ['ab', '-n', '2000', '-c', '100', '-k', url]
        output = check_output(cmd, stderr = sinkhole)
        rps = rps_re.search(output).group(1)
        marks.append(rps)
    return marks

tracking_tag = gitref('master').rstrip('\n')
# open(GIT_TAG_PATH, "w").write(tracking_tag) # todo: prevent push if unchanged
task = argv[1]
if task == 'major':
    today = dt.now()
    ver = today.strftime('%Y%m%d%H%M%S')
    old = read_ver()
    print 'Updating major version from ' + old + ' to ' + ver
    open(VERSION_PATH, "w").write(ver)
    check_output(['git', 'add', VERSION_PATH, BENCH_LOG])
    check_output(['git', 'commit', '-m', 'major ' + old + ' to ' + ver])
    # exit(1)
else:
    log = open(BENCH_LOG, 'a')
    for i, rps in enumerate(hammer(BENCH_URLS)):
        str = '%s rps for %s [%s]' % (rps, BENCH_URLS[i], tracking_tag)
        log.write(str)
        print str

print 'Pushing update... [%s]' % tracking_tag
