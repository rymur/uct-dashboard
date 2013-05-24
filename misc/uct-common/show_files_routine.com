$! show_files.com
$! V1.0
$! 
$! V1.0:		20-04-2003	Programmed by Michael Gerber
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
$! Get data directory
$!
$ data_path = f$trnlnm ("uct_measurement_data")
$ pos_end = f$locate ( ".]", data_path )    
$ pos_begin = f$locate ( "[", data_path ) + 1   
$ rel_dir = f$extract ( pos_begin, pos_end-pos_begin, data_path )
$ pos_end = f$locate ( "[", data_path ) - 1 
$ device_log = f$extract ( 0, pos_end, data_path )
$ device_name = f$trnlnm (device_log)
$ dir_apache = "/" + f$extract ( 0, f$length(device_name)-1, device_name ) 
$ el_num = 0
$ loop:
$   subdir = f$element ( el_num, ".", rel_dir )
$   if subdir .eqs. "." then goto end_loop
$   el_num = el_num + 1
$   dir_apache = dir_apache + "/" + subdir 
$   goto loop
$ end_loop:
$!
$! Print Scanco Header
$!  
$ type microct_common:[www]scanco_beg.html
$ say "<a href=""./show_meas.com"">"
$ say "Back to Measurements"
$ say "</a> | "
$ say "<a href=""./show_slice_interface.com?mnr=''mnr'&snr=''snr'"">"
$ say "Slice Viewer"
$ say "</a><br><br>"
$!
$! say "<table border=""0"" cellpadding=""5"" cellspacing=""0"">"
$! say "<tr><td><b>Sample:</b></td><td>''snr'</td></tr>"
$! say "<tr><td><b>Measurement:</b></td><td>''mnr'</td></tr>"
$! say "</table><br>
$ say "<table border=""0"" cellpadding=""5"" cellspacing=""0"">"
$ say "<tr><td><b>Sample:</b></td><td>"
$ uct_info -s 'snr'
$ say "</td></tr>"
$ say "<tr><td><b>Measurement:</b></td><td>"
$ uct_info -m 'mnr'
$ say "</td></tr>"
$ say "</table><br>
$ say "<table border=""0"" cellpadding=""0"" cellspacing=""5"">"
$ say "<tr>"
$ say "<td>&nbsp</td>"
$ say "<td width=""200"" align=""left""<b>Filename</b></td>"
$ say "<td width=""200"" align=""left""><b>Last Edited</b></td>"
$ say "<td width=""100"" align=""left""><b>Size (kB)</b></td>"
$ say "<td align=""left""><b>Information</b></td>"
$!
$! Check the directory
$!
$ say "<tr><td colspan= "5" bgcolor=""#888888""><b>RSQ</b></td></tr>"
$ DIR_RSQ_START:
$   file = f$search ( "uct_measurement_data:[''snr'.''mnr']*.rsq;" ) - "]["
$   fileName = f$parse ( file,,, "NAME") + f$parse ( file,,, "TYPE" )
$   url = "''dir_apache'/''snr'/''mnr'/''fileName'"
$!   url = "/uct_measurement_data/''snr'/''mnr'/''fileName'"
$   if file .EQS. "" then goto DIR_RSQ_END
$   say "<tr>"
$   say "<td><img src=""/icons/binary.gif"" border=""0""></td> 
$   say "<td><a href=""''url'"">''fileName'</a></td>"
$   say "<td>" + f$file_attributes ( file, "CDT" ) + "</td>"
$   say "<td>" + f$string ( f$file_attributes ( file, "EOF" ) / 2) + "</td>"
$   say "<td><a href=""show_header.com?file=''file'"">CTHEADER</a></td> 
$   say "</tr>
$   goto DIR_RSQ_START
$ DIR_RSQ_END:
$!
$ say "<tr><td colspan= "5" bgcolor=""#888888""><b>ISQ</b></td></tr>"
$ DIR_ISQ_START:
$   file = f$search ( "uct_measurement_data:[''snr'.''mnr']*.isq;" ) - "]["
$   fileName = f$parse ( file,,, "NAME") + f$parse ( file,,, "TYPE" )
$   url = "''dir_apache'/''snr'/''mnr'/''fileName'"
$   if file .EQS. "" then goto DIR_ISQ_END
$   say "<tr>"
$   say "<td><img src=""/icons/binary.gif"" border=""0""></td> 
$   say "<td><a href=""''url'"">''fileName'</a></td>"
$   say "<td>" + f$file_attributes ( file, "CDT" ) + "</td>"
$   say "<td>" + f$string ( f$file_attributes ( file, "EOF" ) / 2) + "</td>"
$   say "<td><a href=""show_header.com?file=''file'"">CTHEADER</a></td> 
$   say "</tr>
$   goto DIR_ISQ_START
$ DIR_ISQ_END: 
$!
$ say "<tr><td colspan= "5" bgcolor=""#888888""><b>MSQ</b></td></tr>"
$ DIR_MSQ_START:
$   file = f$search ( "uct_measurement_data:[''snr'.''mnr']*.msq;" ) - "]["
$   fileName = f$parse ( file,,, "NAME") + f$parse ( file,,, "TYPE" )
$   url = "''dir_apache'/''snr'/''mnr'/''fileName'"
$   if file .EQS. "" then goto DIR_MSQ_END
$   say "<tr>"
$   say "<td><img src=""/icons/binary.gif"" border=""0""></td> 
$   say "<td><a href=""''url'"">''fileName'</a></td>"
$   say "<td>" + f$file_attributes ( file, "CDT" ) + "</td>"
$   say "<td>" + f$string ( f$file_attributes ( file, "EOF" ) / 2) + "</td>"
$   say "<td><a href=""show_header.com?file=''file'"">CTHEADER</a></td> 
$   say "</tr>
$   goto DIR_MSQ_START
$ DIR_MSQ_END:  
$!
$ say "<tr><td colspan= "5" bgcolor=""#888888""><b>AIM</b></td></tr>"
$ DIR_AIM_START:
$   file = f$search ( "uct_measurement_data:[''snr'.''mnr']*.aim;" ) - "]["
$   fileName = f$parse ( file,,, "NAME") + f$parse ( file,,, "TYPE" )
$   url = "''dir_apache'/''snr'/''mnr'/''fileName'" 
$   if file .EQS. "" then goto DIR_AIM_END
$   say "<tr>"
$   say "<td><img src=""/icons/binary.gif"" border=""0""></td> 
$   say "<td><a href=""''url'"">''fileName'</a></td>"
$   say "<td>" + f$file_attributes ( file, "CDT" ) + "</td>"
$   say "<td>" + f$string ( f$file_attributes ( file, "EOF" ) / 2) + "</td>"
$   say "<td><a href=""show_header.com?file=''file'"">AIX</a></td> 
$   say "</tr>
$   goto DIR_AIM_START
$ DIR_AIM_END:
$!
$ say "<tr><td colspan= "5" bgcolor=""#888888""><b>Text</b></td></tr>"
$ DIR_TXT_START:
$   file = f$search ( "uct_measurement_data:[''snr'.''mnr']*.txt;" ) - "]["
$   fileName = f$parse ( file,,, "NAME") + f$parse ( file,,, "TYPE" )
$   url = "''dir_apache'/''snr'/''mnr'/''fileName'"
$   if file .EQS. "" then goto DIR_TXT_END
$   say "<tr>"
$   say "<td><img src=""/icons/text.gif"" border=""0""></td> 
$   say "<td><a href=""''url'"">''fileName'</a></td>"
$   say "<td>" + f$file_attributes ( file, "CDT" ) + "</td>"
$   say "<td>" + f$string ( f$file_attributes ( file, "EOF" ) / 2) + "</td>"
$   say "<td>&nbsp</td> 
$   say "</tr>
$   goto DIR_TXT_START
$ DIR_TXT_END: 
$!
$ say "<tr><td colspan= "5" bgcolor=""#888888""><b>Other Files</b></td></tr>"
$ DIR_OTHER_START:
$   file =f$search("uct_measurement_data:[''snr'.''mnr']*.*;") - "]["
$   ftype = f$parse ( file,,, "TYPE" )
$   if ( ftype .EQS. ".RSQ" ) .OR. ( ftype .EQS. ".ISQ" ) .OR. ( ftype .EQS. ".MSQ" ) .OR. -
    ( ftype .EQS. ".AIM" ) .OR.( ftype .EQS. ".TXT" ) then goto DIR_OTHER_MIDDLE
$   fileName = f$parse ( file,,, "NAME") + f$parse ( file,,, "TYPE" )
$   url = "''dir_apache'/''snr'/''mnr'/''fileName'"
$   if file .EQS. "" then goto DIR_OTHER_END
$   say "<tr>"
$   say "<td><img src=""/icons/unknown.gif"" border=""0""></td>" 
$   say "<td><a href=""''url'"">''fileName'</a></td>"
$   say "<td>" + f$file_attributes ( file, "CDT" ) + "</td>"
$   say "<td>" + f$string ( f$file_attributes ( file, "EOF" ) / 2) + "</td>"
$   say "<td>&nbsp</td>" 
$   say "</tr>"
$ DIR_OTHER_MIDDLE:
$   goto DIR_OTHER_START
$ DIR_OTHER_END:  
$!
$ say "</table>"
$!
$ type microct_common:[www]scanco_end.html
$! 
$ exit
