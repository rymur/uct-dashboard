$print := write sys$output
$print "Content-Type: text/plain"
$print "Set-Cookie: uct_uid=;path=/;"
$print "Set-Cookie: uct_other=;path=/;"

$print ""
$print "done"
