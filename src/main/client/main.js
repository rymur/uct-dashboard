lymph.define("main", function (require) {

    var ajax = require("lymph-client/ajax")
    var util = require("lymph-client/utils")
    var disks = require("disks")
    var scheduling = require("scheduling")
    var measurements = require("measurements")

    var mainEl = $("#main")

    var facesLogin = facesLoginCacher(facesKey())

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
            facesLogin(function (pk) {
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

    function facesLoginCacher (keyStorage) {
        return function (fn) {

            var key = keyStorage.get()

            if (needsRefresh(key)) {
                console.log("from server ===>")
                ajax.get("/cgi-bin/faces_login.com", function (pk) {
                    keyStorage.set({
                        value: pk,
                        dateCached: Date.now()
                    })
                    fn(pk)
                })
            }
            else {
                console.log("from cache --->")
                fn(key.value)
            }
        }

        function needsRefresh (key) {
            if (key.value == null) {
                return true
            } 
            else if (key.dateCached == null) {
                return true
            }
            else {
                return ((Date.now() - key.dateCached) > (1000 * 60 * 30))
            }
        }
    }

    function facesKey () {
        var keyName = "faces-key"
        return {
            get: function  () {
                var rawKey = sessionStorage.getItem(keyName)
                if (rawKey == null) {
                    return {
                        value: null, dateCached: null
                    }
                }
                else {
                    return JSON.parse(rawKey)
                }
            },
            set: function (key) {
                sessionStorage.setItem(keyName, JSON.stringify(key))
            }
        }
    }
})


    //$.get("/cgi-bin/faces.com", function (data) {
        //var url = "http://faces.ccrc.uga.edu/ccrcfaces/data.php?user=manager&rndm=563405192&account=VUIIS_IVIS&rindex=9&pk="+ data.pk + "&mode=0"
        //$.get(url, function (data) {
            //console.log(data)
        //})
    //})

