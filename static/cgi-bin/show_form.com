$print := write sys$output
$print "Content-Type: text/plain"
$print ""
$@parse_params "form"
$print "{""username"":""", param_username, """, ""password"": """, param_password, """}"
