lymph.define("main", function (require) {

    var ajax = require("lymph-client/ajax")
    var util = require("lymph-client/utils")
    var disks = require("disks")
    var scheduling = require("scheduling")
    var measurements = require("measurements")

    var mainEl = $("#main")

    var router = new util.Router({}, {
        "/": function () {
            $("header.title nav a").removeClass("active")
            $("#navMeasurements").addClass("active")
            mainEl.html("")
            mainEl.append(measurements.buildView([]))
        },

        "/scheduling": function () {
            $("header.title nav a").removeClass("active")
            $("#navScheduling").addClass("active")
            mainEl.html("")
            ajax.get("/cgi-bin/faces_login.com", function (pk) {
                ajax.get("/cgi-bin/faces_data.com?pk=" + pk, function (rawData) {
                    var data = scheduling.separate(scheduling.process(rawData))
                    scheduling.buildView(mainEl, new Date(), data)
                })
            })
        },

        "/admin": function () {
            $("header.title nav a").removeClass("active")
            $("#navAdmin").addClass("active")
            mainEl.html("")
            ajax.get("/cgi-bin/disks.com", function (data) {
                mainEl.append(disks.buildView(disks.preProcess(data)))
            })
        }
    })

    if(!window.location.hash){
        window.location.hash = "/"
    }

    router.start(function(){
        console.log("finished starting app")
    })
})


    //$.get("/cgi-bin/faces.com", function (data) {
        //var url = "http://faces.ccrc.uga.edu/ccrcfaces/data.php?user=manager&rndm=563405192&account=VUIIS_IVIS&rindex=9&pk="+ data.pk + "&mode=0"
        //$.get(url, function (data) {
            //console.log(data)
        //})
    //})

