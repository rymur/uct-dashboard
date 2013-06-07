$ say := write/symbol sys$output
$ say "Content-Type: text/plain"
$ say ""
$
$ say "40 measurements backup"
$ say "-----------------------------"
$ @DISK1:[MICROCT]LOGIN.COM
$
$ UCT_LIST
DISK1:[MICROCT.SCRIPTS]MEASUREMENT_TEMPLATE_JSON.TXT
DISK1:[MICROCT50.WWW.DATA]MEASUREMENT_DATA_JSON_40.TXT
0
23100
0
$ say "============================"
$ say ""
$
$ say "50 measurements backup"
$ say "-----------------------------"
$ @DISK1:[MICROCT50]LOGIN.COM
$
$ UCT_LIST
DISK1:[MICROCT.SCRIPTS]MEASUREMENT_TEMPLATE_JSON.TXT
DISK1:[MICROCT50.WWW.DATA]MEASUREMENT_DATA_JSON_50.TXT
0
3100
0
$ say "============================"
