$! main script for updating things related to uct_dashboard web application
$ OUTFILE = P1
$
$ TEMPLATE_FILE := DISK1:[MICROCT.SCRIPTS]MEASUREMENT_TEMPLATE_JSON.TXT
$ DATA_FILE := MICROCT_USER:[DATA.DASHBOARD]'EVAL_SAMPNO'_'EVAL_MEASNO'.txt
$
$ write OUTFILE "$ UCT_LIST"
$ write OUTFILE "''TEMPLATE_FILE'"
$ write OUTFILE "''DATA_FILE'"
$ write OUTFILE "0"
$ write OUTFILE "''EVAL_MEASNO'"
$ write OUTFILE "''EVAL_MEASNO'"
