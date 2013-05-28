$print := write sys$output
$print "Content-Type: text/plain"
$print ""
$@parse_cookies
$if f$type(cookie_uct_uid) .eqs. ""
$then
$  print "not authenticated"
$else
$  if cookie_uct_uid .eqs. ""
$  then
$    print "need to re-login"
$  else
$    print "welcome", cookie_uct_uid
$  endif
$endif
$print "done"
