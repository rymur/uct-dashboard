$! show_disks.com
$ set noon
$ file = f$environment("procedure")
$ directory = f$parse(file,,,"directory")
$ dev = f$parse(file,,,"device")
$ pos = f$locate ( ".", directory )
$ x = dev + f$extract ( 0, pos, directory )+"]login.com" 
$ set message/notext/noidentification/nofacility/noseverity
$ @'x'
$ set message/text/identification/facility/severity
$!
$ @microct_common:[www.cgi-bin]show_disks_routine.com
$ exit
