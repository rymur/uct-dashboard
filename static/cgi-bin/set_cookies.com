$print := write sys$output
$print "Content-Type: text/plain"
$print "Set-Cookie: uct_uid=1234;path=/;"
$print "Set-Cookie: uct_other=hello;path=/;"

$print ""
$print "done"
