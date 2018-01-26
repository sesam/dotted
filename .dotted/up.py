from sys import argv
import dotted
VERSION_PATH = ".dotted/major_version"
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
    dotted.update_major(VERSION_PATH, BENCH_LOG)
else:
    log = open(BENCH_LOG, 'a')
    for i, rps in enumerate(dotted.hammer(BENCH_URLS)):
        str = '%s rps for %s [%s]' % (rps, BENCH_URLS[i], tracking_tag)
        log.write(str + '\n')
        print str

print 'Pushing update... [%s]' % tracking_tag
