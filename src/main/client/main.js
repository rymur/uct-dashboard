var lymphClient = require("lymph-client")
var lymphUtils = require("lymph-utils")

var ajax = lymphClient.ajax
var f = lymphUtils.utils
var html = lymphClient.html
var arrays = lymphUtils.arrays
var data = require("./data")

var disks = require("./disks")
var scheduling = require("./scheduling")
var measurements = require("./measurements")

exports.run = function () {

    var xhr = new XMLHttpRequest()
    var mainEl = $("#main")

    var getKey = f.partial(data.getKey, sessionStorage)
    var setKey = f.partial(data.setKey, sessionStorage)
    var ajaxGet = f.partial(ajax.get, xhr)
    var getFaceAuth = data.facesAuth(ajaxGet, getKey, setKey)

    var deactivateTabs = f.partial(
        f.partial(html.removeClassFrom, "header.title nav a"), "active")

    window.addEventListener("hashchange", handler, false)

    if(window.location.hash === ""){
        window.location.hash = "/"
    }
    else {
        handler()
    }

    function handler () {

        var hash = window.location.hash.slice(1)

        if (hash === "/") {
            deactivateTabs()
            html.addClassTo("#navMeasurements", "active")
            mainEl.html("")
            mainEl.append(measurements.view([]))
        }

        else if (hash === "/scheduling") {
            deactivateTabs()
            html.addClassTo("#navScheduling", "active")
            mainEl.html("")
            getFaceAuth(function (pk) {
                ajaxGet("/facesData?pk=" + pk.key, function (rawData) {
                    var data = scheduling.separate(scheduling.process(rawData))
                    scheduling.buildView(mainEl, new Date(), data)
                })
            })
        }

        else if (hash === "/admin") {
            deactivateTabs()
            html.addClassTo("#navAdmin", "active")
            mainEl.html("")
            ajax.get(xhr, "/cgi-bin/disks.com", function (data) {
                mainEl.append(disks.buildView(disks.preProcess(data)))
            })
        }
    }
}

function flip (f) {
    return function (a) {
        return function (b) {
            return f(b, a)
        }
    }
}

