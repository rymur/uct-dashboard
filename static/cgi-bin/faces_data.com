$ say := write sys$output
$ say "Content-Type: text/plain"
$ say ""
$ faces_file_name := faces_data.txt
$ @parse_params 
$ if f$type(param_pk) .nes. ""
$ then
$   call getdata 'param_pk' "9" "40"
$   call getdata 'param_pk' "16" "50"
$ else
$   say "invalid parameter"
$ endif
$
$ getdata: subroutine
$   url = "http://faces.ccrc.uga.edu/ccrcfaces/data.php?user=manager&rndm=563405192&account=VUIIS_IVIS&rindex=''P2'&pk=''P1'&mode=0"
$   mcr disk1:[microct50.main.curl]curl.exe_nossl 'url' --output 'faces_file_name'
$   line_count = 0
$   open input_file 'faces_file_name'
$   read_loop:
$     read/end_of_file=read_loop_end input_file line
$     line_count = line_count + 1
$     if line_count .ge. 10
$     then
$       say 'P3', " ", line
$     endif
$     goto read_loop
$   read_loop_end:
$   close input_file
$ endsubroutine
