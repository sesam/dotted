from sys import argv
from datetime import datetime as dt
from subprocess import check_output
from os import devnull
# import const
import re
VERSION_PATH = ".dotted/major_version"
# const.version_path = VERSION_PATH
SHA1_PATH = ".dotted/current_sha1"
BENCH_LOG = ".dotted/bench.log"
BENCH_URLS = [
    'http://localhost:5001/',
    'http://localhost:5001/data',
]

def read_ver():
    try:
        return open(VERSION_PATH, "r").read(14)
    except IOError:
        return '0' * 14

def gitref(branch):
    cmd = 'git rev-parse --verify HEAD'.split()
    return check_output(cmd)

def hammer(urls):
    marks = []
    sinkhole = open(devnull, 'w')
    rps_re = re.compile(r"Requests per second: *(\d+)")
    for url in BENCH_URLS:
        cmd = ['ab', '-n', '2000', '-c', '100', '-k', url]
        output = check_output(cmd, stderr = sinkhole)
        rps = rps_re.search(output).group(1)
        marks.append(rps)
    return marks

githash = gitref('master').rstrip('\n')
open(SHA1_PATH, "w").write(githash)
task = argv[1]
if task == 'major':
    today = dt.now()
    ver = today.strftime('%Y%m%d%H%M%S')
    old = read_ver()
    print 'Updating major version from ' + old + ' to ' + ver
    open(VERSION_PATH, "w").write(ver)
else:
    log = open(BENCH_LOG, 'a')
    for i, rps in enumerate(hammer(BENCH_URLS)):
        str = '%s rps for %s [%s]' % (rps, BENCH_URLS[i], githash)
        log.write(str)
        print str

print 'Pushing update... [%s]' % githash
