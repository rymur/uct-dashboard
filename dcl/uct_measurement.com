$  SET NOON
$  SCSI_HW = F$TRNLNM("MICROCT_SCSI")
$ 
$  IF (SCSI_HW .NES. "") THEN ALLOCATE MICROCT_SCSI
$ 
$  RUN UM:UCT_CLEAR_UNICON_ERROR.EXE
$  RUN UM:UCT_T.EXE
$  IF (SCSI_HW .NES. "") THEN DEALLOCATE MICROCT_SCSI
$  EXIT