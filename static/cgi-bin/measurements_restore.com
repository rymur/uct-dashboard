$ say := write/symbol sys$output
$ say "Content-Type: application/json"
$ say ""
$ say "["
$ first == 1
$ call process_file DISK1:[MICROCT50.WWW.DATA]MEASUREMENT_DATA_JSON_40.TXT
$ call process_file DISK1:[MICROCT50.WWW.DATA]MEASUREMENT_DATA_JSON_50.TXT
$ say "]"
$
$ process_file: subroutine
$   open measurement_data_file 'P1'
$   loop:
$     read/end_of_file=loop_end measurement_data_file record
$     if (record .nes. "")
$     then
$       if first
$       then
$         row_data == " " + record
$         first == 0
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
