$ print := write sys$output
$ @parse_cookies
$ status = "400 Failed"
$ if f$type(cookie_uct_uid) .nes. ""
$ then
$   if cookie_uct_uid .nes. ""
$   then
$     open input_file users.csv
$     read_loop:
$       read/end_of_file=eof input_file user
$       sid = f$element(2, ",", user)
$       if sid .nes. "," .and. sid .eqs. cookie_uct_uid
$       then
$         status = "200 OK"
$         goto eof
$       else
$         goto read_loop
$       endif
$     eof:
$     close input_file
$   else
$     status = "400 Failed"
$   endif
$ else
$   status = "400 Failed"
$ endif
$ print "Content-type: text/plain"
$ print "Status: ", status
$ print ""
$ print ""
