lymph.define("main", function (require) {

    var c = require("lymph-client")
    var disks = require("disks")
    var scheduling = require("scheduling")
    var mainEl = $("#main")

    routie("/", function () {
        $("header.title nav a").removeClass("active")
        $("#navMeasurements").addClass("active")
        mainEl.html("")
    })

    routie("/scheduling", function () {
        $("header.title nav a").removeClass("active")
        $("#navScheduling").addClass("active")
        mainEl.html("")
        var rawData = "2013-05-24 16:00:00 2013-05-24 17:00:00 fe_nf1 Jean nf1 col2 bone | N/A\n2013-05-15 17:00:00 2013-05-16 06:00:00 fe_nasa VBX | N/A\n2013-06-07 16:00:00 2013-06-07 21:00:00 orear_plasmin  | N/A"
        var events = scheduling.process(rawData)
        console.log(events)
        scheduling.buildView(mainEl, events)
    })

    routie("/admin", function () {
        $("header.title nav a").removeClass("active")
        $("#navAdmin").addClass("active")
        mainEl.html("")
        c.ajax.get("/cgi-bin/disks.com", function (data) {
            mainEl.append(disks.buildView(disks.preProcess(data)))
        })
    })

})

