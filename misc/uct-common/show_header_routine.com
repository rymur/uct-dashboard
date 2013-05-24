$! show_header.com
$! V1.1
$! 
$! V1.0:		20-04-2003	Programmed by Michael Gerber
$! V1.1:		04-JUL-2003	B. Koller (SEQ Header added)		
$!
$ say := "write SYS$OUTPUT"
$ say "Content-Type: text/html"
$ say ""
$ UCT_INFO :== $UM:UCT_INFO
$!
$! Get Parameters
$!
$ queryStrLen = f$length ( query_string )
$!
$ var = "file"
$ varLen = f$length ( var )
$ posBegin = f$locate ( var, query_string )
$ if posBegin .nes. queryStrLen
$ then
$   substr = f$extract ( posBegin + varLen + 1, queryStrLen, query_string ) 
$   posEnd = f$locate ( "&", substr )
$   file = f$extract ( 0, posEnd, substr )
$ else
$   file = ""
$ endif 
$!
$! Print Scanco Header
$!  
$ type microct_common:[www]scanco_beg.html
$!
$ extension = f$parse(file,,,"TYPE")
$ filename = f$parse ( file,,, "NAME" ) +  f$parse ( file,,, "TYPE" )
$ say "<b>''filename'</b><br><br> 
$ say "<pre>"
$ if (extension .eqs. ".AIM")
$ then
$   aix -l 'file'
$ else
$   ctheader 'file'
$ endif
$ say "</pre>"
$! 
$ type microct_common:[www]scanco_end.html
$ exit
$!
