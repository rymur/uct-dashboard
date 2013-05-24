$ say := "write SYS$OUTPUT"
$ say "Content-Type: text/html"
$ say ""
$ type microct_common:[www]scanco_beg.html
$ say "<H2>Disks currently available on System</H2>"     
$ say "<PRE>"
$ say "<B><FONT COLOR=#000000>Disk    Free Space  Physical Device Label              Total    Usage  User</B></FONT>"
$!
$  highlight_limit = 95
$  size_in_mb == "True"
$  size_in_gb == "True"
$  length == ""
$  rowv   == ""
$!
$  total_msize == 0
$  total_fsize == 0
$!
$  show_label == "True"
$
$!   say "-------------------------------------------------------------------------------"
$ if (f$trnlnm("ADISK0") .nes. "" .and. f$trnlnm("IDISK0") .nes. "") 
$ then 
$	char_a = "A"
$	char_i = "I"
$ else
$	char_a = ""
$	char_i = ""
$ endif
$!
$ if (f$trnlnm("ADISK0") .nes. f$trnlnm("ADISK1"))
$ then
$!                                                    devnam  Descr.    Disk
$   if f$trnlnm("ADISK0") .nes. "" then call show_dev adisk0  "SYSTEM" 'char_a'disk0
$   if f$trnlnm("ADISK1") .nes. "" then call show_dev adisk1  "USER" 'char_a'disk1
$ else
$   if f$trnlnm("ADISK0") .nes. "" then call show_dev adisk0  "SYS/USR" 'char_a'disk0/1
$ endif
$!
$ if (f$trnlnm("IDISK0") .nes. f$trnlnm("IDISK1"))
$ then
$   if f$trnlnm("IDISK0") .nes. "" then call show_dev idisk0  "SYSTEM" 'char_i'disk0
$   if f$trnlnm("IDISK1") .nes. "" then call show_dev idisk1  "USER" 'char_i'disk1
$ else
$   if f$trnlnm("IDISK0") .nes. "" then call show_dev idisk0  "SYS/USR" 'char_i'disk0/1
$ endif
$!                                                 Devnam  Descr. Disk
$!  disk5 (e.g.) must point to adisk5 OR idisk5 first for binded disks!
$ if f$trnlnm("DISK2") .nes. "" then call show_dev disk2  "DATA1" disk2
$ if f$trnlnm("DISK3") .nes. "" then call show_dev disk3  "DATA2" disk3
$ if f$trnlnm("DISK4") .nes. "" then call show_dev disk4  "DATA3" disk4
$ if f$trnlnm("DISK5") .nes. "" then call show_dev disk5  "DATA4" disk5
$ if f$trnlnm("DISK6") .nes. "" then call show_dev disk6  "DATA5" disk6
$ if f$trnlnm("DISK7") .nes. "" then call show_dev disk7  "DATA6" disk7
$ if f$trnlnm("DISK8") .nes. "" then call show_dev disk8  "DATA7" disk8
$ if f$trnlnm("DISK9") .nes. "" then call show_dev disk9  "DATA8" disk9
$ if f$trnlnm("DISK10") .nes. "" then call show_dev disk10  "DATA9" disk10
$ if f$trnlnm("DISK11") .nes. "" then call show_dev disk11  "DATA10" disk11
$ if f$trnlnm("DISK12") .nes. "" then call show_dev disk12  "DATA11" disk12
$!
$   say "-------------------------------------------------------------------------------"
$!
$  call show_tot
$!
$ goto exit_com
$!
$!
$show_dev: subroutine
$!
$  if f$getdvi(p1,"EXISTS") .eqs. "TRUE"
$  then
$    if f$getdvi(p1,"VOLSETMEM")
$    then
$!     disk5 (e.g.) must point to adisk5 OR idisk5 first!
$      p1 = f$trnlnm(p1) - ":"
$      vc = f$getdvi(p1,"VOLCOUNT")
$    else
$      vc = 1
$    endif
$    volcounter = 0
$    fb = 0
$    gb = 0
$volstart:
$    character[0,8] = f$integer(volcounter+65)
$    devnam = F$FAO("!AS!AS:",p1,character) - "A:" - ":" + ":"
$    if f$getdvi(devnam,"EXISTS") .eqs. "TRUE"
$    then
$      fbt = -1
$      fbt = f$getdvi(devnam,"FREEBLOCKS")
$      if fbt .eq. -1 then exit
$      mbt = f$getdvi(devnam,"MAXBLOCK")
$    else
$      fbt = 0
$      mbt = 0
$    endif
$    volcounter = volcounter + 1
$    fb = fb + f$integer(fbt)/1000
$    gb = gb + f$integer(mbt)/1000
$    if volcounter .lt. vc then goto volstart
$!
$    hn = f$getdvi(p1,"HOST_NAME")
$    vn = f$getdvi(p1,"VOLNAM")
$    dn = f$getdvi(p1,"DEVNAM") - "_"
$    dt = f$getdvi(p1,"DEVICE_TYPE_NAME")
$!
$    total_msize   == total_msize + gb
$    total_fsize   == total_fsize + fb
$    fsize_rel     = 100 - (fb*100/gb)
$!
$    if fsize_rel .gt. highlight_limit 
$    then 
$      length == 23
$      rowv == "<B><FONT COLOR=#FF0000>"
$      rowe == "</B></FONT>"
$    else
$      length == 23
$      rowv == "<B><FONT COLOR=#000000>"
$      rowe == "</B></FONT>"
$    endif
$    call add_str  "''p3'" 8
$    call add_size "''fb'" 7
$    call add_str  "" 2
$    call add_str  "''dn'" 16
$    if show_label .eqs. "True"
$    then
$      call add_str  "''vn'" 17
$    else
$      call add_str  "''dt'" 17
$    endif
$    call add_size "''gb'" 6
$    call add_int	 "''fsize_rel'" 3 "%"
$    call add_str  "" 2
$    call add_str  "''p2'" 8
$  else
$    length == 23
$    rowv == "<B><FONT COLOR=#777777>"
$    rowe == "</B></FONT>"
$    call add_str  "''p3'" 21
$    call add_str  """Does not exist""" 16
$  endif
$  call add_str "''rowe'" 11
$  say rowv
$  endsubroutine
$!
$show_tot: subroutine
$!
$!
$  size_in_gb 	 = "True" ! switch to GB for total
$  fsize_rel     = 100-(f$integer(total_fsize*100)/f$integer(total_msize)) 
$  length == 23
$  rowv == "<B><FONT COLOR=#000000>"
$  call add_str  "Total" 8
$  total_fsize = total_fsize
$  call add_size "''total_fsize'" 7
$  call add_str  "" 2
$  call add_str  "" 17
$  call add_str  "" 16
$  total_msize = total_msize
$  call add_size "''total_msize'" 6
$  call add_int	 "''fsize_rel'" 3 "%"
$  call add_str  "" 3
$  call add_str  "" 6
$  call add_str  "''rowe'" 11
$ say rowv
$ endsubroutine
$!
$add_size: subroutine
$  size_gb = f$string(f$integer(p1)/2048)
$  length == length + f$integer(p2) - f$length(size_gb)
$  rowv[length,f$length(size_gb)] :== 'size_gb'
$  length = length + f$length(size_gb)
$  rowv[length,4] :== " GB "
$  length == length + 4
$ endsubroutine
$!
$!
$add_int: subroutine
$  length == length + f$integer(p2) - f$length(p1)
$  rowv[length,f$length(p1)] :== 'p1'
$  length = length + f$length(p1)
$  rowv[length,4] :== " ''p3' "
$  length == length + f$length(p3) + 2
$ endsubroutine
$!
$!
$add_str: subroutine
$  rowv[length,f$integer(p2)] :== 'p1'
$  length == length + f$integer(p2)
$ endsubroutine
$!
$!
$ exit_com:      
$ say "</PRE>"
$ type microct_common:[www]scanco_end.html
$exit
