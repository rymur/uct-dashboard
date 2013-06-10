$! UCT_RECONSTRUCTION.COM
$! ----------------------
$! Command-Procedure to submit a 2D (Slice) Reconstruction
$! Resubmitting itself if error occurs
$! Resubmitting itself to delete its logfile if successful
$! B. Koller, May 11, 1998
$! A.Laib: version limit 10 entered. March 9, 2004
$!
$! P1 = RSQ-file, P2 = Slice-Nr, P3 = Log-file of batch job, P4 = Delete logfile
$!
$ IF P4 .NES. ""
$ THEN
$   DELETE/NOLOG/NOCONFIRM 'P3' ! Delete LOG-File of batch-job if
$ EXIT                          ! finished successful
$ ENDIF
$!
$ LOGFILE = F$SEARCH("''P3'")           ! get name & version nr of logfile
$ UCT_RECONSTRUCT :== $UCT_RECONSTRUCTION
$ UCT_RECONSTRUCT 'P1' 'P2'
$ IF $STATUS .EQ. 0
$ THEN
$   open/append RECONS_LOG MICROCT_USER:[DATA.DASHBOARD]RECONS.LOG
$   write RECONS_LOG P1 + "," + P2
$   close RECONS_LOG
$   VERSION = F$PARSE(LOGFILE,,,"VERSION") - ";"
$   IF F$INTEGER(VERSION) .GT. 10 THEN EXIT
$   SUBMIT/QUEUE=UCT_RECONSTRUCTION_QUEUE/LOG='P3'/NOPRINT -
        UCT_RECONSTRUCTION_FILE /PARA=('P1','P2','P3')
$   EXIT $STATUS
$ ELSE
$ IF $STATUS .EQ. 2
$ THEN
$   EXIT $STATUS
$ ENDIF
$ IF LOGFILE .NES. "" THEN -
$   NOW = F$TIME()
$   SUBMIT/QUEUE=SYS$FAST/NOLOG/NOPRINT/AFTER="''NOW'+00:00:30.00" -
        UCT_RECONSTRUCTION_FILE /PARA=('P1','P2','LOGFILE',"TRUE")
$ EXIT
