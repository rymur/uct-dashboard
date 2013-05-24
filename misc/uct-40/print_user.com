$! show_meas.com
$ set noon
$ write SYS$OUTPUT "Content-type:text/html"
$ write SYS$OUTPUT ""
$ file = f$environment("procedure")
$ directory = f$parse(file,,,"directory")
$ pos = f$locate ( ".", directory )
$ x = f$extract ( 1, pos-1, directory ) 
$ write SYS$OUTPUT x
$ EXIT
