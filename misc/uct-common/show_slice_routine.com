$! show_slice.com
$! V1.0
$! 
$! V1.0:		20-04-2003	Programmed by Michael Gerber
$! V1.0A:		25-SEP-2003	B.Koller SEQ_to_image moved to UT:
$! V1.0B:		22-SEP-2005	jmb: Update for Itanium
$! V1.0C:		07-APR-2008	jmb: Update for Apache2 (CSWS 2.1.1)
$!
$ say := "write sys$output"
$! say "Content-type: text/plain"
$! say "Content-type: image/jpeg"
$! say ""
$! say "AAAAA"
$! show dev/full sys$output
$! mcr []fixbg_prog.exe
$! mcr []apache$flip_ccl.exe
$! mcr apache$common:[000000]apache$flip_ccl.exe_alpha
$! jmb 22.9.2005: Update to use Itanium flip_ccl.exe below
$! mcr apache$common:[000000]apache$flip_ccl.exe
$! jmb 7.9.2007: Update for Apache2 (CSWS 211)
$ mcr apache$common:[000000]apache$set_ccl.exe -S -1
$! say "BBBBB"
$ say f$fao("!AS!/!/", "Content-Type: image/jpeg")
$!
$! Get Parameters
$!
$ queryStrLen = f$length ( query_string )
$!
$ var = "scale"
$ varLen = f$length ( var )
$ posBegin = f$locate ( var, query_string )
$ if posBegin .nes. queryStrLen
$ then
$   substr = f$extract ( posBegin + varLen + 1, queryStrLen, query_string ) 
$   posEnd = f$locate ( "&", substr )
$   scale = f$integer ( f$extract ( 0, posEnd, substr ) )
$ else
$   scale = 0
$ endif
$!
$ var = "slice"
$ varLen = f$length ( var )
$ posBegin = f$locate ( var, query_string )
$ if posBegin .nes. queryStrLen
$ then
$   substr = f$extract ( posBegin + varLen + 1, queryStrLen, query_string ) 
$   posEnd = f$locate ( "&", substr )
$   slice = f$integer ( f$extract ( 0, posEnd, substr ) )
$ else
$   slice = 0
$ endif   
$!    
$ var = "fileName"
$ varLen = f$length ( var )
$ posBegin = f$locate ( var, query_string )
$ if posBegin .nes. queryStrLen
$ then
$   substr = f$extract ( posBegin + varLen + 1, queryStrLen, query_string ) 
$   posEnd = f$locate ( "&", substr )
$   fileName = f$extract ( 0, posEnd, substr ) 
$ else
$   fileName = 0                 
$ endif
$!
$ var = "norm"
$ varLen = f$length ( var )
$ posBegin = f$locate ( var, query_string )
$ if posBegin .nes. queryStrLen
$ then
$   substr = f$extract ( posBegin + varLen + 1, queryStrLen, query_string ) 
$   posEnd = f$locate ( "&", substr )
$   norm = f$integer ( f$extract ( 0, posEnd, substr ) )
$ else
$   norm = 0
$ endif   
$!    
$!
$!
$ mcr ut:seq_to_image -i='fileName' -o=sys$output -f=j -q=75 -s='scale' -n='norm' -b='slice' -e='slice' -c=1 
