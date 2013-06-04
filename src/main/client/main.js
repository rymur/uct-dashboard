lymph.define("main", function (require) {

    var c = require("lymph-client")
    var disks = require("disks")
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
    })

    routie("/admin", function () {
        $("header.title nav a").removeClass("active")
        $("#navAdmin").addClass("active")
        mainEl.html("")
        c.ajax.get("/cgi-bin/disks.com", function (data) {
            mainEl.append(disks.buildView(disks.preProcess(data)))
        })
    })

    routie("*", function () {
        routie("/")
    })
})

