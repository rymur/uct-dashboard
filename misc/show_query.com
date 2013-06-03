$print := write sys$output
$print "Content-Type: text/plain"
$print ""
$@parse_params 
$print "{""username"":""", param_username, """, ""password"": """, param_password, """}"
