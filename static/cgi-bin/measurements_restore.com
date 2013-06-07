$ say := write/symbol sys$output
$ say "Content-Type: application/json"
$ say ""
$
$ say "["
$ call process_file disk1:[microct.scripts]measurement_data_json_40.txt
$ say "]"
$
$ process_file: subroutine
$   open measurement_data_file 'P1'
$   first = 1
$   loop:
$     read/end_of_file=loop_end measurement_data_file record
$     if (record .nes. "")
$     then
$       if first
$       then
$         row_data == " " + record
$         first = 0
$       else
$         row_data == "," + record
$       endif
$       say row_data
$       goto loop
$     endif
$   loop_end:
$  
$   close measurement_data_file
$ endsubroutine
