$ say := write sys$output
$ say "Content-Type: text/plain"
$ say ""
$
$ data_dir = "disk1:[microct50.www.data.current]"
$
$ loop:
$   record_file_name = f$search("''data_dir'%%%%%%%_%%%%%%%.TXT", 1)
$   if record_file_name .nes. ""
$   then
$     open record_file 'record_file_name'
$     read/end_of_file=eof record_file record
$     say record
$     eof:
$     close record_file
$     goto loop
$   endif
$ loop_end:
