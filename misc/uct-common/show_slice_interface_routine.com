$! show_slice_interface.com
$! V1.0
$! 
$! V1.0:		20-04-2003	Programmed by Michael Gerber
$!
$ say := "write SYS$OUTPUT"
$ say "Content-Type: text/html"
$ say ""
$ UCT_INFO :== $UM:UCT_INFO
$ type microct_common:[www]scanco_beg.html
$!
$! Get Parameters
$!
$ queryStrLen = f$length ( query_string )
$!
$ var = "startSlice"
$ varLen = f$length ( var )
$ posBegin = f$locate ( var, query_string )
$ if posBegin .nes. queryStrLen
$ then
$   substr = f$extract ( posBegin + varLen + 1, queryStrLen, query_string ) 
$   posEnd = f$locate ( "&", substr )
$   startSlice = f$integer ( f$extract ( 0, posEnd, substr ) )
$ else
$   startSlice = 0
$ endif      
$!     
$ var = "endSlice"
$ varLen = f$length ( var )
$ posBegin = f$locate ( var, query_string )
$ if posBegin .nes. queryStrLen
$ then
$   substr = f$extract ( posBegin + varLen + 1, queryStrLen, query_string ) 
$   posEnd = f$locate ( "&", substr )
$   endSlice = f$integer ( f$extract ( 0, posEnd, substr ) )
$ else
$   endSlice = -1
$ endif 
$!
$ var = "nrSlices"
$ varLen = f$length ( var )
$ posBegin = f$locate ( var, query_string )
$ if posBegin .nes. queryStrLen
$ then
$   substr = f$extract ( posBegin + varLen + 1, queryStrLen, query_string ) 
$   posEnd = f$locate ( "&", substr )
$   nrSlices = f$integer ( f$extract ( 0, posEnd, substr ) )      
$ else
$   nrSlices = 8
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
$ var = "mnr"
$ varLen = f$length ( var )
$ posBegin = f$locate ( var, query_string )
$ if posBegin .nes. queryStrLen
$ then
$   substr = f$extract ( posBegin + varLen + 1, queryStrLen, query_string ) 
$   posEnd = f$locate ( "&", substr )
$   mnr = f$extract ( 0, posEnd, substr )
$ else
$   mnr = 0
$ endif 
$!
$ var = "snr"
$ varLen = f$length ( var )
$ posBegin = f$locate ( var, query_string )
$ if posBegin .nes. queryStrLen
$ then
$   substr = f$extract ( posBegin + varLen + 1, queryStrLen, query_string ) 
$   posEnd = f$locate ( "&", substr )
$   snr = f$extract ( 0, posEnd, substr )
$ else
$   snr = 0
$ endif 
$!
$ var = "scaleMultiple"
$ varLen = f$length ( var )
$ posBegin = f$locate ( var, query_string )
$ if posBegin .nes. queryStrLen
$ then
$   substr = f$extract ( posBegin + varLen + 1, queryStrLen, query_string ) 
$   posEnd = f$locate ( "&", substr )
$   scaleMultiple = f$extract ( 0, posEnd, substr )
$ else
$   scaleMultiple = 8
$ endif 
$!
$ var = "scaleSingle"
$ varLen = f$length ( var )
$ posBegin = f$locate ( var, query_string )
$ if posBegin .nes. queryStrLen
$ then
$   substr = f$extract ( posBegin + varLen + 1, queryStrLen, query_string ) 
$   posEnd = f$locate ( "&", substr )
$   scaleSingle = f$extract ( 0, posEnd, substr )
$ else
$   scaleSingle = 2
$ endif 

$! 
$ var = "singleSlice"
$ varLen = f$length ( var )
$ posBegin = f$locate ( var, query_string )
$ if posBegin .nes. queryStrLen
$ then
$   substr = f$extract ( posBegin + varLen + 1, queryStrLen, query_string ) 
$   posEnd = f$locate ( "&", substr )
$   singleSlice = f$extract ( 0, posEnd, substr )
$ else
$   singleSlice = 0
$ endif 
$! 
$ var = "isSingle"
$ varLen = f$length ( var )
$ posBegin = f$locate ( var, query_string )
$ if posBegin .nes. queryStrLen
$ then
$   hasSingleSlice = 1
$ else
$   hasSingleSlice = 0
$ endif            
$!
$! Check the directory
$!
$
$ pipe uct_info -m 'mnr' | ( read sys$input info_str ; define/job info_str_log &info_str )
$ info_str = f$trnlnm ( "info_str_log" )
$ deassign/table=lnm$job info_str_log
$ endPos = f$length ( info_str )        
$ strPos = f$locate ( ":", info_str ) 
$ substr = f$extract ( strPos + 1, endPos, info_str )       
$ strPos = f$locate ( ":", substr ) + 4
$ endPos = f$locate ( "Sli", substr ) - 2
$ strLen = endPos - strPos  
$ substr = f$extract ( strPos, strLen + 1, substr ) 
$ total_slices = f$integer ( substr )
$ if ( endSlice .eq. -1 )
$ then 
$   endSlice = total_slices - 1
$ endif
$
$ fileName = f$search ( "uct_measurement_data:[''snr'.''mnr']%%%%%%%%.isq;1" )
$ say "<H2>Slice Viewer</H2>"
$ say "<a href=""./show_meas.com"">"
$ say "Back to Measurements"
$ say "</a> | "
$ say "<a href=""./show_files.com?mnr=''mnr'&snr=''snr'"">"
$ say "Show Files"
$ say "</a><br><br>"
$! 
$ say "<b>File:</b>" 
$ say/sym fileName
$ say "<br><br>"
$ say "''total_slices' Slices<br><br>"
$ if nrSlices .gt. endSlice - startSlice + 1 
$ then
$   nrSlices = endSlice - startSlice + 1
$ endif
$ 
$!
$! Print the form for Slice Selection
$!
$ say "<form action=""show_slice_interface.com"" method=""get"">" 
$! say "<table border=""0"" cellpadding=""5"" cellspacing=""0"">"
$! say "<tr>"
$!
$! say "<td valign=""top"">"
$ say "<table border=""1"" cellpadding=""5"" cellspacing=""0"">"
$ say "<input type=""hidden"" name=""snr"" value=""''snr'"">"
$ say "<input type=""hidden"" name=""mnr"" value=""''mnr'"">"
$ say "<tr>"
$ say "<td rowspan=""3"" valign=""top""><b>Multiple Slices</b></td>"
$ say "<td>Slices:</td>"
$ say "<td>"
$ say "From: <input size=""5"" name=""startSlice"" value=""''startSlice'"">"
$ say "To: <input size=""5"" name=""endSlice"" value=""''endSlice'"">"
$ say "</td>"
$ say "<td rowspan=""3"">"
$ say "<input type=""submit"" name=""isMultiple"" value=""Show"">"
$ say "</td>"
$ say "</tr><tr>"
$ say "<td>Shown Slices:</td>"
$ say "<td><input size=""5"" name=""nrSlices"" value=""''nrSlices'""></td>"
$ say "</tr><tr>"
$ say "<td>Downscale Factor:</td>"
$ say "<td><input size=""5"" name=""scaleMultiple"" value=""''scaleMultiple'""></td>"
$ say "</tr>"
$ say "<tr>"
$ say "<td rowspan=""2"" valign=""top""><b>Single Slice</b></td>" 
$ say "<td>Slice:</td>
$ say "<td><input size=""5"" name=""singleSlice"" value=""''singleSlice'""></td>" 
$ say "<td rowspan=""2"">"
$ say "<input type=""submit"" name=""isSingle"" value=""Show"">"
$ say "</td>"
$ say "</tr><tr>"
$ say "<td>Downscale Factor:</td>"
$ say "<td><input size=""5"" name=""scaleSingle"" value=""''scaleSingle'""></td>"
$ say "</tr>"
$ say "<tr>"
$ say "<td><b>Norm</b><br>0=>max data_value</td>
$ say "<td colspan=""3"">
$ say "<input size=""5"" name=""norm"" value=""''norm'"">"
$ say "</td>"
$ say "</tr>"
$ say "</table>"
$! say "</td>"
$!
$! say "<td valign=""top"">"
$! say "<table border=""1"" cellpadding=""5"" cellspacing=""0"">"
$! say "<tr>"
$! say "<td colspan="2"><b>Save the currently shown slice range to data directory</b></td>"
$! say "</tr>"
$! say "<tr>"
$! say "<td>"
$! say "<table border=""0"" cellpadding=""5"" cellspacing=""0"">"
$! say "<tr>"
$! say "<td>Filename:</td>"
$! say "<td><input size=""20"" name=""scaleSingle"" value=""''scaleSingle'""></td>
$! say "</tr>"
$! say "<tr>"
$! say "<td>Format:</td>"
$! say "<td>"
$! say "<select name=""format"">"
$! say "<option>TIFF</option>"
$! say "<option>JPEG</option>"
$! say "</select>"
$! say "</td>"
$! say "</tr>"
$! say "</table>"
$! say "</td>"
$! say "<td>"
$! say "<input type=""submit"" name=""toFile"" value=""Save"">"
$! say "</td>"
$! say "</tr>"
$! say "</table>"
$! say "</td>"
$!
$! say "</tr>"
$! say "</table>"
$ say "</form>" 
$ say "<br>
$!
$! Calculate Number of Rows ...
$!
$ if ( hasSingleSlice .EQ. 0 )
$ then
$   scale = scaleMultiple 
$   totalSlices = endSlice - startSlice
$   imgWidth = 150
$   screenWidth = 800
$   imgPerRow = screenWidth / (imgWidth + 20)
$   nrRows = nrSlices / imgPerRow
$   imgLastRow = nrSlices - imgPerRow * nrRows
$   if ( imgLastRow .NE. 0 ) then nrRows = nrRows + 1
$ else
$   scale = scaleSingle
$   totalSlices  = 1
$   imgPerRow = 1
$   nrRows = 1
$   imgLastRow = 0
$   startSlice = singleSlice
$ endif  
$!
$! Create the table with the images
$!
$ say "<table border=1 cellpadding=10 cellspacing=0>"
$ rowCnt = 0
$ imgCnt = 0
$ ROW_START:
$ if ( rowCnt .GE. nrRows ) then GOTO ROW_END
$   say "<tr>"
$!   if ( ( rowCnt .eq. nrRows - 1 ) .AND. ( imgLastRow .NE. 0 ) ) 
$!     then imgThisRow = imgLastRow
$!     else imgThisRow = imgPerRow
$!   endif
$   frameCnt = 0
$   FRAME_START: 
$   if ( frameCnt .GE. imgPerRow ) then GOTO FRAME_END
$     say "<td>"
$     if ( ( rowCnt .eq. nrRows - 1 ) .AND. ( imgLastRow .NE. 0 ) .AND. (frameCnt .GE. imgLastRow ) )
$       then  say "&nbsp"
$       else
$         if ( nrSlices .EQ. 1 )
$           then currentSlice = startSlice 
$           else currentSlice = startSlice + ( totalSlices * imgCnt ) / ( nrSlices - 1 )
$         endif
$         say "<a href=""./show_slice_interface.com?snr=''snr'&mnr=''mnr'&startSlice=''startSlice'&endSlice=''endSlice'&isSingle=Show&"
$         say "nrSlices=''nrSlices'&scaleMultiple=''scaleMultiple'&singleSlice=''currentSlice'&scaleSingle=''scaleSingle'&norm=''norm'"">" 
$         say "<img src=""./show_slice.com?scale=''scale'&fileName=''fileName'&slice=''currentSlice'&norm=''norm'"" border=""0"">"
$         say "</a>"
$         say "<br>
$         say currentSlice
$         imgCnt = imgCnt + 1 
$     endif
$     say "</td>"
$     frameCnt = frameCnt + 1
$   GOTO FRAME_START
$   FRAME_END:
$   say "</tr>"
$   rowCnt = rowCnt + 1
$ GOTO ROW_START
$ ROW_END:
$ say "</table>"
$    
$ 
$        
$
$ say "<br>"
$ say "<br>"
$!
$!
$! START_SAMPLE:
$! SAMPLE = F$SEARCH ("UCT_MEASUREMENT_DATA:[000000]%%%%%%%%.DIR;1",1)
$! IF (SAMPLE .EQS. "") THEN GOTO END_SAMPLE
$! SNR = F$PARSE("''SAMPLE'",,,"NAME")
$! say "<H3>"
$! uct_info -s 'snr'
$! say "</H3>"
$! START_MEAS:
$! MEAS = F$SEARCH ("UCT_MEASUREMENT_DATA:[''SNR']%%%%%%%%.DIR;1",2)
$! IF (MEAS .EQS. "") THEN GOTO END_MEAS
$! MNR = F$PARSE("''MEAS'",,,"NAME")
$! uct_info -m 'mnr'
$ say "</PRE>"
$ type microct_common:[www]scanco_end.html
$exit
$!
