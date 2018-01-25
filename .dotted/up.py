from sys import argv
from datetime import datetime as dt
VERSION_PATH = ".dotted/major_version"

def read_ver():
    try:
        return open(VERSION_PATH, "r").read(14)
    except IOError:
        return '0' * 14

task = argv[1]
if task == 'major':
    today = dt.now()
    ver = today.strftime('%Y%m%d%H%M%S')
    old = read_ver()
    print 'Updating major version from ' + old + ' to ' + ver
    open(VERSION_PATH, "w").write(ver)

print 'Pushing update...'
