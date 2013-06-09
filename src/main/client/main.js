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
        ajax.get("/cgi-bin/faces_data.com", function (rawData) {
            var data0 = scheduling.process(rawData)
            var data1 = scheduling.separate(data0)
            window.debugdata = data1
            mainEl.append(scheduling.buildView(new Date(), data1))
        })
    })

    routie("/admin", function () {
        $("header.title nav a").removeClass("active")
        $("#navAdmin").addClass("active")
        mainEl.html("")
        ajax.get("/cgi-bin/disks.com", function (data) {
            mainEl.append(disks.buildView(disks.preProcess(data)))
        })
    })

    //$.get("/cgi-bin/faces.com", function (data) {
        //var url = "http://faces.ccrc.uga.edu/ccrcfaces/data.php?user=manager&rndm=563405192&account=VUIIS_IVIS&rindex=9&pk="+ data.pk + "&mode=0"
        //$.get(url, function (data) {
            //console.log(data)
        //})
    //})
})

