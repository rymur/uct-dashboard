$ say := "write sys$output"
$ say "Content-Type: text/html"
$ say ""
$ type microct_common:[www]scanco_beg.html
$ say "<PRE>"
$ query_string = query_string - "Mnumber="
$ nr = f$locate("Log=",query_string)
$ number = f$extract(0,nr-1,query_string)
$ if f$locate("Log=MeasLog",query_string) .nes. f$length(query_string) 
$ then
$   pipe pipe search sys$scratch:measurement*.log 'number'] | -
    search sys$input MEASUREMENT_ | - 
    ( read sys$input search_text ; define/nolog/job search_text_log &search_text )
$   line = f$trnlnm ( "search_text_log" )
$!   if f$locate("%SEARCH-I-NOMATCHES",line) .eq. f$length(line)   
$   if f$extract(0, 1, line) .nes. "%"  
$   then
$     type/nopage 'line'
$   else
$     say "There is no measurement log available for this measurement."
$   endif
$ else
$   if f$locate("Log=Eval3DLog",query_string) .nes. f$length(query_string) 
$   then
$     number8 = f$fao("!8ZL",f$integer(number))
$     logfile = f$search("sys$scratch:eval_*_*_''number8'*.log")
$     if (logfile .nes. "")
$     then
$       type/nopage 'logfile'
$     else
$       pipe pipe search sys$scratch:UCT_EVALUATION_V4.log;* 'number'] | -
       search sys$input UCT_EVALUATION_V4.LOG | - 
       ( read sys$input search_text ; define/nolog/job search_text_log &search_text )
$       line = f$trnlnm ( "search_text_log" )
$       if f$extract(0, 1, line) .nes. "%"  
$       then
$         type/nopage 'line'
$	else
$         say "There is no evaluation log available for this measurement."
$	endif
$     endif
$   else
$! 
$     if f$locate("Log=Eval2DRes",query_string) .nes. f$length(query_string) 
$     then
        if f$search ( "uct_histo_results:histo_2d_''number'.dat", 3) .nes. ""
$       then                                                                  
$         type uct_histo_results:histo_2d_'number'.dat
$       else
$         say "There is no 2D evaluation available for this measurement."
$       endif
$     else 
$       if f$locate("Log=Eval3DRes",query_string) .nes. f$length(query_string) 
$       then
$         uct_list 'number'
$       endif
$     endif
$   endif
$ endif
$ say "</PRE>"
$ type microct_common:[www]scanco_end.html
$exit
