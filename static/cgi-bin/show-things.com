$print := write sys$output
$
$print "Content-Type: application/json"
$print ""
$print "["
$temp = f$getqui("")
$first = 0
$QLOOP:
$  qname = f$getqui("DISPLAY_QUEUE", "QUEUE_NAME", "*")
$  if qname .eqs. ""
$  then
$    goto QLOOP_END
$  else
$    if first .eq. 0
$    then
$      print " {""", qname, """: {""jobs"": ["
$      first = 1
$    else
$      print ",{""", qname, """: {""jobs"": ["
$    endif
$    first_job = 0
$    JLOOP:
$      jname = f$getqui("DISPLAY_JOB", "JOB_NAME", , "ALL_JOBS")
$      if jname .eqs. ""
$      then
$        goto JLOOP_END
$      else
$        if first_job .eq. 0
$        then
$          print """", jname, """"
$          first_job = 1
$        else
$          print ",""", jname, """"
$        endif
$        goto JLOOP
$      endif
$    JLOOP_END:
$    print "]}}"
$    goto QLOOP
$  endif
$QLOOP_END:
$print "]"

