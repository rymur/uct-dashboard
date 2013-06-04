$ say := write/symbol sys$output
$ say "Content-Type: application/json"
$ say ""
$
$ first = 1
$ say "["
$ loop:
$   dev = f$device("*", "DISK")
$   if (dev .nes. "")
$   then
$     if first
$     then
$       row_data == " "
$       call row
$       first = 0
$     else
$       row_data == ","
$       call row
$     endif
$     say row_data
$     goto loop
$   endif
$ loop_end:
$ say "]"
$
$ row: subroutine
$   row_data == row_data + "{"
$   call field 1 "devName"    'f$string(dev - "_" - ":")'
$   call field 1 "logVolName" 'f$getdvi(dev, "logvolnam")'
$   call field 1 "volName"    'f$getdvi(dev, "volnam")'
$   call field 1 "volCount"   'f$getdvi(dev, "volcount")'
$   call field 1 "volSize"    'f$getdvi(dev, "volsize")'
$   call field 1 "free"       'f$getdvi(dev, "freeblocks")'
$   call field 1 "max"        'f$getdvi(dev, "maxblock")'
$   call field 1 "host"       'f$getdvi(dev, "host_name")'
$   call field 0 "custer"     'f$getdvi(dev, "cluster")'
$   row_data == row_data + "}"
$ endsubroutine
$
$ field: subroutine
$   row_data == row_data + """" + P2 + """:"
$   if f$type(P3) .eqs. "INTEGER"
$   then
$     row_data == row_data + P3
$   else
$     row_data == row_data + """" + P3 + """"
$   endif
$   if P1 then row_data == row_data + ","
$ endsubroutine
