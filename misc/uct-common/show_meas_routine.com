$! show_meas.com
$! V1.1
$! 
$! V1.0:				Programmed by Bruno Koller
$! V1.1:		20-4-2003	Slice Viewer and File Viewer 
$!					included (MG)
$!
$ say := "write SYS$OUTPUT"
$ say "Content-Type: text/html"
$ say ""
$ UCT_INFO :== $UM:UCT_INFO
$ type microct_common:[www]scanco_beg.html
$ say "<a href=""../"">Back to Main Page</a>"
$ say "<H2>Measurements currently on Disk</H2>"     
$ say "<PRE>"
$!
$!
$ START_SAMPLE:
$ SAMPLE = F$SEARCH ("UCT_MEASUREMENT_DATA:[000000]%%%%%%%%.DIR;1",1)
$ IF (SAMPLE .EQS. "") THEN GOTO END_SAMPLE
$ SNR = F$PARSE("''SAMPLE'",,,"NAME")
$ say "<H3>"
$ uct_info -s 'snr'
$ say "</H3>"
$ START_MEAS:
$ MEAS = F$SEARCH ("UCT_MEASUREMENT_DATA:[''SNR']%%%%%%%%.DIR;1",2)
$ IF (MEAS .EQS. "") THEN GOTO END_MEAS
$ MNR = F$PARSE("''MEAS'",,,"NAME")
$ uct_info -m 'mnr'
$
$ line1= "      <a href=""show_slice_interface.com?mnr=''mnr'&snr=''snr'"">Slice Viewer</a> | "
$
$ mnr_int = f$integer (mnr)  
$! if f$search ( "uct_histo_results:histo_2d_''mnr_int'.dat", 3) .nes. ""
$! then
$   line2=  "<a href=""uct_show.com?Mnumber=''mnr_int'&Log=Eval2DRes"">2D Results</a> | "
$! else 
$!   line2=  "2D Results | "
$! endif
$
$ line3 =  "<a href=""uct_show.com?Mnumber=''mnr'&Log=Eval3DRes"">3D Results</a> | 
$
$ search_text = ""
$! pipe search sys$scratch:UCT_EVALUATION_V4.log;* 'mnr'] | -
$!    search sys$input UCT_EVALUATION /out=sys$scratch:xxxx.xxxx
$! open/read infile sys$scratch:xxxx.xxxx
$! read/end=continue/error=continue infile search_text
$! close infile
$! continue:
$! type sys$scratch:xxxx.xxxx
$!   delete/noconf/nolog sys$scratch:xxxx.xxxx;*
$! pipe pipe search sys$scratch:UCT_EVALUATION_V4.log;* 'mnr'] | - 
$!   search sys$input UCT_EVALUATIO | -
$!   ( read sys$input search_text ; define/nolog/job search_text_log &search_text )
$! search_text = f$trnlnm ( "search_text_log" )
$! if f$locate("UCT_EVALUATION",search_text) .eq. f$length(search_text)  
$! if f$extract(0, 1,search_text) .eqs. "%"  
$! then
$!   line4 = "3D Eval. Logfile | "
$! else
$   line4 = "<a href=""uct_show.com?Mnumber=''mnr'&Log=Eval3DLog"">3D Eval. Logfile</a> | " 
$! endif
$
$!  pipe pipe search sys$scratch:measurement*.log 'mnr'] | -
$!    search sys$input MEASUREMENT_ | - 
$!   ( read sys$input search_text ; define/nolog/job search_text_log &search_text )
$! search_text = f$trnlnm ( "search_text_log" )
$! if f$locate("MEASUREMENT_",search_text) .eq. f$length(search_text)   
$! if f$extract(0, 1,search_text) .eqs. "%"  
$! then
$!   line5 = "Meas.Logfile | "
$! else
$   line5 = "<a href=""uct_show.com?Mnumber=''mnr'&Log=MeasLog"">Meas.Logfile</a> | "
$! endif
$ 
$ line6 = "<a href=""show_files.com?mnr=''mnr'&snr=''snr'"">Files</a>"
$
$ line = line1 + line2 + line3 + line4 + line5 + line6
$ say/sym line
$
$ GOTO START_MEAS
$ END_MEAS:
$ GOTO START_SAMPLE
$ END_SAMPLE:
$ say "</PRE>"
$ type microct_common:[www]scanco_end.html
$exit
$!
