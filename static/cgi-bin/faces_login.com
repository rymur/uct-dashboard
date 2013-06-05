$ say := write sys$output
$ say "Content-Type: text/plain"
$ say ""
$ faces_file_name := faces_login.txt
$ mcr disk1:[microct50.main.curl]curl.exe_nossl --data "account=VUIIS_IVIS&savegrp=on&user=manager&saveusr=on&pwd=&savepwd=on&passwd=japon&end=0" "http://faces.ccrc.uga.edu/ccrcfaces/login.php" -o 'faces_file_name'
$ pk = "invalid"
$ open input_file 'faces_file_name'
$ read_loop:
$   read/end_of_file=read_loop_end input_file line
$   if f$match_wild(line, "*<INPUT TYPE=HIDDEN NAME='pk' VALUE='*'>*")
$   then
$     pk = f$extract(36, 32, f$edit(line, "TRIM"))
$   endif
$   goto read_loop
$ read_loop_end:
$ close input_file
$ say pk
