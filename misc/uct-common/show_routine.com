$ on warning then goto finish
$ say := "write sys$output"
$ say "Content-Type: text/html"
$ say ""
$ type microct_common:[www]scanco_beg.html
$ say "<PRE>"
$ query_string = query_string - "Command="
$ NUM = 0
$ command = ""
$ LOOP:
$       value = F$ELEMENT(NUM,"+",query_string)
$       IF value .EQS. "+" THEN GOTO END
$       command = command + value + " "
$       NUM = NUM +1
$       GOTO LOOP
$ END:
$ SHOW 'command'
$ FINISH:
$ say "</PRE>"
$ type microct_common:[www]scanco_end.html
$exit
