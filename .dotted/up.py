from sys import argv
import dotted
VERSION_PATH = ".dotted/major_version"
TRACKING_TAG_PATH = ".dotted/tracking_tag"
BENCH_LOG = ".dotted/bench.log"
PORT = 5001
BENCH_URLS = [
    'http://localhost:%d/' % PORT,
    'http://localhost:%d/data' % PORT,
]

tracking_tag = dotted.gitref('master').rstrip('\n')
open(TRACKING_TAG_PATH, "w").write(tracking_tag)
task = argv[1]
if task == 'major':
    dotted.update_major(VERSION_PATH, BENCH_LOG)
elif task == 'purge':
    dotted.silentremove(VERSION_PATH)
    dotted.silentremove(BENCH_LOG)
else:
    log = open(BENCH_LOG, 'a')
    for i, rps in enumerate(dotted.hammer(BENCH_URLS)):
        str = '%s rps for %s [%s]' % (rps, BENCH_URLS[i], tracking_tag)
        log.write(str + '\n')
        print str
    # todo: prevent push if tracking_tag haven't changed
    print 'Pushing update... [%s]' % tracking_tag
