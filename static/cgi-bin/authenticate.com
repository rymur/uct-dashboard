$ print := write sys$output
$ authenticated = 0
$ @parse_params "form"
$ if f$type(param_username) .nes. "" .and. f$type(param_password) .nes. ""
$ then
$   open/read/write users_file users.csv
$   read_loop:
$     read/end_of_file=eof users_file user
$     username = f$element(0, ",", user)
$     password = f$element(1, ",", user)
$     if param_username .eqs. username .and. param_password .eqs. password
$     then
$       sid = f$unique()
$       new_user = username + "," + password + "," + sid
$       write/update users_file new_user
$       authenticated = 1
$       goto eof
$     else
$       goto read_loop
$     endif
$   eof:
$   close users_file
$ endif
$ print "Content-Type: text/plain"
$ if authenticated
$ then
$   print "Set-Cookie: uct_uid=", sid, ";path=/;"
$ else
$   print "Status: 403"
$ endif
$ print ""
$ print ""
