$  say := write/symbol sys$output
$  say "Content-Type: text/plain"
$  say ""
$ 
$  DATA_DIR := DISK1:[MICROCT50.DATA.DATASHBOARD]
$  FIRST = 1
$  say "["
$  loop:
$    RECORD_FILE = f$search("''DATA_DIR'*.TXT", 1)
$    if RECORD_FILE .nes. ""
$    then
$      open INPUT 'RECORD_FILE'
$      read/end_of_file=eof INPUT RECORD
$      if FIRST
$      then
$        say RECORD
$        FIRST = 0
$      else
$        say ",", RECORD
$      endif
$      eof:
$      close INPUT
$      goto loop
$    endif
$  loop_end:
$  say "]"
$  
