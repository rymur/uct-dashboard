var client = require("lymph-client")

var ajax = client.ajax
var util = client.utils

var data = require("./data")
var disks = require("./disks")
var scheduling = require("./scheduling")
var measurements = require("./measurements")

exports.run = function () {

    var xhr = new XMLHttpRequest()
    var mainEl = $("#main")

    var getKey = function () {
        return data.getKey(sessionStorage)
    }

    var setKey = function (key) {
        data.setKey(sessionStorage, key)
    }

    var ajaxGet = function (url, cb) {
        ajax.get(xhr, url, cb)
    }

    var getFaceAuth = data.facesAuth(ajaxGet, getKey, setKey)

    console.log("running")

    window.addEventListener("hashchange", handler, false)

    function handler () {

        var hash = window.location.hash.slice(1)

        if (hash === "/") {
            $("header.title nav a").removeClass("active")
            $("#navMeasurements").addClass("active")
            mainEl.html("")
            mainEl.append(measurements.view([]))
        }

        else if (hash === "/scheduling") {
            $("header.title nav a").removeClass("active")
            $("#navScheduling").addClass("active")
            mainEl.html("")
            getFaceAuth(function (pk) {
                ajaxGet("/facesData?pk=" + pk.key, function (rawData) {
                    var data = scheduling.separate(scheduling.process(rawData))
                    scheduling.buildView(mainEl, new Date(), data)
                })
            })
        }

        else if (hash === "/admin") {

            $("header.title nav a").removeClass("active")
            $("#navAdmin").addClass("active")
            mainEl.html("")
            ajax.get(xhr, "/cgi-bin/disks.com", function (data) {
                mainEl.append(disks.buildView(disks.preProcess(data)))
            })
        }
    }

    if(window.location.hash === ""){
        window.location.hash = "/"
    }
    else {
        handler()
    }
}

