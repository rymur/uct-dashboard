$! ================================================================================ 
$! This script is the master control script for handling uct events.
$!
$! The basic concept is to generate event data that can be aggregated by other 
$! systems
$! 
$! Event tracking powerful, but it has a significant downside in that the event
$! log file can grow to an unwieldy size
$!
$! One solution is to implement a log rotation mechanism, which will keep the 
$! log file at a reasonable size.
$!
$! Scan and evaluation events would not be a problem, but reconstructions for a
$! given day could produce thousands of events.
$!
$! Example Scenario:
$!   10 scans at 1000 slices => ((1000 / 5) * 2) * 10 = 4000
$!
$!   If you used daily event logs you would have 365 log files per year, ranging
$!   from 0 to 9000 records in each file
$! 
$! Solution:
$!   Since reconstruction events are relativily useless once the recon is finished
$!   then a temporary recon event log would be optimal.  This way we could
$!   use the event log to determine the completion status of the re
$! ================================================================================ 
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
$    open/append/error=open_error P1EVENTS_LOG MICROCT_USER:[DATA.DASHBOARD]EVENTS.LOG
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
$! ================================================================================ 
$! Reconstructions are split into multiple jobs, in order to scale the process
$! across the cluster.  This makes it difficult to determine when a particular
$! reconstruction is done.
$!
$! TODO: need to identify the number
$!
$  recon_started: subroutine
$    TYPE      = P1
$    RSQ_DIR_0 = f$parse(P2,,,"directory")
$    RSQ_DIR_1 = f$extract(1, f$length(RSQ_DIR_0) - 2, RSQ_DIR_0)
$    SAMP_NO   = f$element(2, ".", RSQ_DIR_1)
$    MEAS_NO   = f$element(3, ".", RSQ_DIR_1)
$    SLICE     = P3
$    EVENT     = "{""date"":""''TIME_STAMP'"",""type"":""rs"",""data"":""''SAMP_NO',''MEAS_NO',''SLICE'""}"
$    LOG_FILE  = 
$    call log_it MICROCT_USER:[DATA.DASHBOARD]EVENTS_RECON.LOG
$  endsubroutine
$
$  recon_completed: subroutine
$    TYPE      = P1
$    RSQ_DIR_0 = f$parse(P2,,,"directory")
$    RSQ_DIR_1 = f$extract(1, f$length(RSQ_DIR_0) - 2, RSQ_DIR_0)
$    SAMP_NO   = f$element(2, ".", RSQ_DIR_1)
$    MEAS_NO   = f$element(3, ".", RSQ_DIR_1)
$    SLICE     = P3
$    EVENT     = "{""date"":""''TIME_STAMP'"",""type"":""rc"",""rsq"":""''P2'"",""slice"":""''P3'""}"
$    LOG_FILE  = 
$    call log_it MICROCT_USER:[DATA.DASHBOARD]EVENTS_RECON.LOG
$  endsubroutine
