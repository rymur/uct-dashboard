$ say := "write SYS$OUTPUT"
$ say "Content-Type: text/html"
$ say ""
$ type microct_common:[www]scanco_beg.html
$ say "<H2>Jobs currently on System</H2>"     
$ say "<PRE>"
$ say "Nr.  Entry       Job                        Log-file"
$!
$ call showqueue *ADMIN
$ call showqueue *BACKUP
$ call showqueue *BATCH
$ call showqueue *FAST
$ call showqueue *SLOW
$ call showqueue *FE
$ 
$!
$ say "</PRE>"
$ type microct_common:[www]scanco_end.html
$exit
$!

$ SHOWQUEUE: SUBROUTINE
$  PREDEL = "<A HREF=""./delete_entry.com?"
$  POSTDEL = """>Delete Job</A>"
$  PRESHOW = "<A HREF=""./type_log.com?"
$  POSTSHOW= """>"
$  POSTSHOW2= "</A>"
$  QLOOP:
$  QNAME = F$GETQUI("DISPLAY_QUEUE","QUEUE_NAME","''P1'*")
$  IF QNAME .EQS. "" THEN EXIT
$  SAY ""
$  SAY "<B><FONT COLOR=#000000>", QNAME, ":</B></FONT>
$  NR = 0
$  JLOOP:
$  NOACCESS = F$GETQUI("DISPLAY_JOB","JOB_INACCESSIBLE",,"ALL_JOBS")
$  IF NOACCESS .EQS. "TRUE" THEN GOTO JLOOP
$  IF NOACCESS .EQS. "" THEN GOTO QLOOP
$  JNAME = F$GETQUI("DISPLAY_JOB","JOB_NAME",,"FREEZE_CONTEXT,ALL_JOBS")
$  JENTRY = F$GETQUI("DISPLAY_JOB","ENTRY_NUMBER",,-
	"FREEZE_CONTEXT,ALL_JOBS")
$  JLOG = F$GETQUI("DISPLAY_JOB","LOG_SPECIFICATION",,-
	"FREEZE_CONTEXT,ALL_JOBS")
$  FILENAME = F$PARSE("''JLOG'",,,"NAME")
$  IF FILENAME .EQS. "" 
$  THEN
$    IF JLOG .NES. ""
$    THEN
$      JLOG = F$PARSE("''JNAME'","''JLOG'",,,"SYNTAX_ONLY")
$    ENDIF
$  ENDIF
$  JSTATUS = "Unknown"
$  JSTAT = F$GETQUI("DISPLAY_JOB","JOB_EXECUTING",,"FREEZE_CONTEXT,ALL_JOBS")
$  IF JSTAT .EQS. "TRUE" THEN JSTATUS = "Executing"
$  JSTAT = F$GETQUI("DISPLAY_JOB","JOB_PENDING",,"FREEZE_CONTEXT,ALL_JOBS")
$  IF JSTAT .EQS. "TRUE" THEN JSTATUS = "Pending"
$  JSTAT = F$GETQUI("DISPLAY_JOB","JOB_HOLDING",,"FREEZE_CONTEXT,ALL_JOBS")
$  IF JSTAT .EQS. "TRUE" THEN JSTATUS = "Holding"
$  JSTAT = F$GETQUI("DISPLAY_JOB","JOB_ABORTING",,"FREEZE_CONTEXT,ALL_JOBS")
$  IF JSTAT .EQS. "TRUE" THEN JSTATUS = "Aborting"
$  NR = NR + 1
$  STRING = F$FAO("!4AS !5AS !AS!ZL!AS !AS !AS !AS!AS!AS!AS!AS", -
	F$STRING(NR),F$STRING(JENTRY),-
	PREDEL,JENTRY,POSTDEL,JNAME,JSTATUS,PRESHOW, -
	JLOG,POSTSHOW,JLOG,POSTSHOW2)
$  WRITE/SYMBOL SYS$OUTPUT STRING
$  GOTO JLOOP
$ ENDSUBROUTINE
