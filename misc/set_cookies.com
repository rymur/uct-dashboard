$print := write sys$output
$print "Content-Type: text/plain"
$print "Set-Cookie: uct_uid=1234;path=/;"

$print ""
$print "done"
