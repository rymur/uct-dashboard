$! This script is the master control script for handling uct events.
$!
$! Essentially it's responsible for determining the type of event being logged
$! and writing to the appropriate file
$! ============================================================================
$  TIME_STAMP = f$time()
$  if f$locate("e_", P1) .eq. 0 then goto 'P1'
$  exit
$
$  e_ms:
$  call log_it "{""date"":""''TIME_STAMP'"",""type"":""ms"",""sampleno"":""''P2'"",""measno"":""''P3'"",""slices"":""''P4'""}"
$  exit
$
$  e_mc:
$  call log_it "{""date"":""''TIME_STAMP'"",""type"":""mc"",""measno"":""''P2'""}"
$  exit
$
$  e_rs:
$  call log_it "{""date"":""''TIME_STAMP'"",""type"":""rs"",""rsq"":""''P2'"",""slice"":""''P3'""}"
$  exit
$
$  e_rc:
$  call log_it "{""date"":""''TIME_STAMP'"",""type"":""rc"",""rsq"":""''P2'"",""slice"":""''P3'""}"
$  exit
$
$  log_it: subroutine
$    open/append/error=open_error EVENTS_LOG MICROCT_USER:[DATA.DASHBOARD]EVENTS.LOG
$    write/symbol/error=write_error EVENTS_LOG P1
$    goto done
$    open_error:
$    write sys$output "could not open event log: ''P1'"
$    exit
$    write_error:
$    write sys$output "could not write event log: ''P1'"
$    done:
$    close EVENTS_LOG
$    exit
$  endsubroutine
$
$  reconstruction: subroutine
$    TYPE      = P1
$    RSQ_DIR_0 = f$parse(P2,,,"directory")
$    RSQ_DIR_1 = f$extract(1, f$length(RSQ_DIR_0) - 2, RSQ_DIR_0)
$    SAMP_NO   = f$element(2, ".", RSQ_DIR_1)
$    MEAS_NO   = f$element(3, ".", RSQ_DIR_1)
$    SLICE     = P3
$    call log_it "{""date"":""''TIME_STAMP'"",""type"":""rs"",""data"":""''SAMP_NO',''MEAS_NO',''SLICE'""}"
$  endsubroutine
