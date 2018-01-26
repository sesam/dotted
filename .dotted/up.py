from sys import argv
from datetime import datetime as dt
# import const
import dotted
VERSION_PATH = ".dotted/major_version"
# const.version_path = VERSION_PATH
# TRACKING_TAG_PATH = ".dotted/tracking_tag"
BENCH_LOG = ".dotted/bench.log"
BENCH_URLS = [
    'http://localhost:5001/',
    'http://localhost:5001/data',
]

tracking_tag = dotted.gitref('master').rstrip('\n')
# open(GIT_TAG_PATH, "w").write(tracking_tag) # todo: prevent push if unchanged
task = argv[1]
if task == 'major':
    today = dt.now()
    ver = today.strftime('%Y%m%d%H%M%S')
    old = dotted.read_14(VERSION_PATH)
    print 'Updating major version from ' + old + ' to ' + ver
    dotted.update_major(old, ver, VERSION_PATH, BENCH_LOG)
else:
    log = open(BENCH_LOG, 'a')
    for i, rps in enumerate(dotted.hammer(BENCH_URLS)):
        str = '%s rps for %s [%s]' % (rps, BENCH_URLS[i], tracking_tag)
        log.write(str + '\n')
        print str

print 'Pushing update... [%s]' % tracking_tag
