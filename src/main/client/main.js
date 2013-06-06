lymph.define("main", function (require) {

    var ajax = require("lymph-client/ajax")
    var disks = require("disks")
    var scheduling = require("scheduling")
    var measurements = require("measurements")
    var mainEl = $("#main")

    routie("/", function () {
        $("header.title nav a").removeClass("active")
        $("#navMeasurements").addClass("active")
        mainEl.html("")
        mainEl.append(measurements.buildView([]))
    })

    routie("/scheduling", function () {
        $("header.title nav a").removeClass("active")
        $("#navScheduling").addClass("active")
        mainEl.html("")
        var rawData = "2013-05-06 15:00:00 2013-05-06 22:00:00 migne_par  | N/A\n2013-05-07 09:00:00 2013-05-07 14:00:00 migne_par  | N/A\n2013-05-07 15:00:00 2013-05-08 03:00:00 orear_plasmin  | N/A\n2013-05-08 12:00:00 2013-05-08 17:00:00 migne_par  | N/A\n2013-05-08 18:00:00 2013-05-08 21:00:00 orear_htopic  | N/A\n2013-05-09 16:00:00 2013-05-10 24:00:00 fe_net  | N/A\n2013-05-11 00:00:00 2013-05-11 03:00:00 fe_net  | N/A\n2013-05-11 10:00:00 2013-05-11 18:00:00 migne_par  | N/A\n2013-05-12 09:00:00 2013-05-12 19:00:00 migne_par  | N/A\n2013-05-12 19:00:00 2013-05-12 22:00:00 orear_htopic  | N/A\n2013-05-13 09:00:00 2013-05-13 11:00:00 orear_plasmin  | N/A\n2013-05-13 11:00:00 2013-05-13 14:00:00 orear_plasmin  | N/A\n2013-05-13 14:00:00 2013-05-13 17:00:00 fe_net  | N/A\n2013-05-13 17:00:00 2013-05-14 20:00:00 fe_net  | N/A\n2013-05-15 12:00:00 2013-05-15 17:00:00 orear_plasmin  | N/A\n2013-05-15 17:00:00 2013-05-16 06:00:00 fe_nasa VBX | N/A\n2013-05-16 09:00:00 2013-05-16 13:00:00 orear_plasmin  | N/A\n2013-05-16 13:00:00 2013-05-16 15:00:00 orear_plasmin  | N/A\n2013-05-16 15:00:00 2013-05-16 17:00:00 orear_plasmin  | N/A\n2013-05-16 17:00:00 2013-05-17 01:00:00 fe_net  | N/A\n2013-05-17 09:00:00 2013-05-17 17:00:00 orear_plasmin  | N/A\n2013-05-18 15:00:00 2013-05-18 22:00:00 migne_par  | N/A\n2013-05-19 13:00:00 2013-05-19 17:00:00 migne_par  | N/A\n2013-05-19 18:00:00 2013-05-19 20:00:00 orear_htopic  | N/A\n2013-05-20 09:00:00 2013-05-20 17:00:00 orear_plasmin  | N/A\n2013-05-20 17:00:00 2013-05-20 21:00:00 orear_plasmin  | N/A\n2013-05-21 09:00:00 2013-05-21 17:00:00 orear_plasmin  | N/A\n2013-05-21 18:00:00 2013-05-21 23:00:00 migne_par  | N/A\n2013-05-22 12:00:00 2013-05-22 17:00:00 orear_plasmin  | N/A\n2013-05-22 18:00:00 2013-05-22 23:00:00 migne_par  | N/A\n2013-05-23 09:00:00 2013-05-23 12:00:00 orear_plasmin  | N/A\n2013-05-23 18:00:00 2013-05-23 23:00:00 orear_htopic  | N/A\n2013-05-24 16:00:00 2013-05-24 17:00:00 fe_nf1 Jean nf1 col2 bone | N/A\n2013-05-28 18:00:00 2013-05-28 19:00:00 orear_htopic  | N/A\n2013-05-28 19:00:00 2013-05-28 22:00:00 orear_htopic  | N/A\n2013-06-03 15:00:00 2013-06-03 21:00:00 migne_par  | N/A\n2013-06-05 15:00:00 2013-06-05 21:00:00 fe_nf1  | N/A\n2013-06-06 16:00:00 2013-06-06 21:00:00 migne_par  | N/A\n2013-06-07 16:00:00 2013-06-07 21:00:00 orear_plasmin  | N/A"
        var events = scheduling.process(rawData)
        scheduling.buildView(mainEl, events)
    })

    routie("/admin", function () {
        $("header.title nav a").removeClass("active")
        $("#navAdmin").addClass("active")
        mainEl.html("")
        ajax.get("/cgi-bin/disks.com", function (data) {
            mainEl.append(disks.buildView(disks.preProcess(data)))
        })
    })

    $.get("/cgi-bin/faces.com", function (data) {
        var url = "http://faces.ccrc.uga.edu/ccrcfaces/data.php?user=manager&rndm=563405192&account=VUIIS_IVIS&rindex=9&pk="+ data.pk + "&mode=0"
        $.get(url, function (data) {
            console.log(data)
        })
    })
})

