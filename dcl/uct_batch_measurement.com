$	IF P6 .EQS. "" 
$	THEN
$	  WRITE SYS$OUTPUT "P1: Operator"
$	  WRITE SYS$OUTPUT "P2: Sample"
$	  WRITE SYS$OUTPUT "P3: Controlfile"
$	  WRITE SYS$OUTPUT "P4: Nr of slices"
$	  WRITE SYS$OUTPUT "P5: Pos. 1st slice in mm with decimal point"
$	  WRITE SYS$OUTPUT "P6: Shutdown X-Ray-Tube"
$	  WRITE SYS$OUTPUT "P7: Carousel Pos (-1 = default pos)"
$	  EXIT
$	ENDIF
$	IF P7 .EQS. "" THEN P7 := -1 
$	WRITE SYS$OUTPUT "Operator: ''p1'"
$	WRITE SYS$OUTPUT "Sample: ''p2'"
$	WRITE SYS$OUTPUT "Controlfile: ''p3'"
$	WRITE SYS$OUTPUT "Nr of slices: ''p4'"
$	WRITE SYS$OUTPUT "Pos. 1st slice: ''p5'"
$	WRITE SYS$OUTPUT "Shutdown X-Ray-Tube: ''p6'"
$	WRITE SYS$OUTPUT "Carousel Posistion: ''p7'"
$
$	COMMANDFILE := SYS$SCRATCH:MEASUREMENT_'p2'.COM
$	LOGFILE     := SYS$SCRATCH:MEASUREMENT_'P2'.LOG
$
$	SHOW SYMBOL COMMANDFILE
$	SHOW SYMBOL LOGFILE
$
$	OPEN/WRITE OUTFILE 'COMMANDFILE'
$	COMMANDFILE = F$SEARCH("''COMMANDFILE'") ! GET VERSION NR
$!
$!	First write script
$!
$   SCSI_HW = F$TRNLNM("MICROCT_SCSI")
$	WRITE OUTFILE "$ WAIT 00:00:30.00"
$	IF (SCSI_HW .NES. "") THEN WRITE OUTFILE "$ ALLOCATE MICROCT_SCSI"
$
$!  vanderbilt script for the "dashboard" application (see script for parameter reference)
$   WRITE OUTFILE "$ @um:uct_dashboard_logger ""e_ms"" ""''P2'"" ""''P3'"" ""''P4'"""
$
$	WRITE OUTFILE "$ RUN UM:UCT_T_BATCH.EXE"
$	WRITE OUTFILE "''P1'"
$	WRITE OUTFILE "''P2'"
$	WRITE OUTFILE "''P3'"
$	WRITE OUTFILE "''P4'"
$	WRITE OUTFILE "''P5'"
$	WRITE OUTFILE "''P6'"
$	WRITE OUTFILE "''P7'"
$!
$!	End process
$!
$	IF (SCSI_HW .NES. "") THEN WRITE OUTFILE "$ DEALLOCATE MICROCT_SCSI"
$!	WRITE OUTFILE "$ DELETE/NOLOG/NOCONFIRM ''COMMANDFILE'"
$
$!  vanderbilt script for the "dashboard" application (see script for parameter reference)
$   WRITE OUTFILE "$ @um:uct_dashboard_logger ""e_mc"" ""''P3'"""
$!
$	CLOSE OUTFILE
$!
$!	Submit measurement
$!
$ 	SUBMIT/NOPRINT/LOG='LOGFILE' 'COMMANDFILE'/QUEUE=UCT_MEASUREMENT_QUEUE"
$	EXIT
