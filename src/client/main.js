var lymphClient = require("lymph-client")
var lymphUtils = require("lymph-utils")

var ajax = lymphClient.ajax
var f = lymphUtils.utils
var html = lymphClient.html
var arrays = lymphUtils.arrays
var data = require("./data")

var disks = require("./disks")
var Scheduling = require("./scheduling")
var measurements = require("./measurements")
var WeekView = require("./WeekView")
var WeekCalendar = require("./weekCalendar")
var Bus = require("./Bus")

exports.run = function () {

    var xhr = new XMLHttpRequest()
    var bus = Bus.create()
    var mainNode = document.getElementById("main")

    var scheduling = Scheduling.create(bus, xhr)

    var deactivateTabs = f.partial(
        f.partial(html.removeClassFrom, "header.title nav a"), "active")

    window.addEventListener("hashchange", handler, false)

    if(window.location.hash === ""){
        window.location.hash = "/scheduling"
    }
    else {
        handler()
    }

    function handler () {

        var path = pathFrom(window.location)

        if (path === "/") {
            window.location.hash = "/scheduling"
        }

        else if (path === "/scheduling") {

            deactivateTabs()

            html.addClassTo("#navScheduling", "active")
            html.clear(mainNode)

            mainNode.appendChild(scheduling.el)
            scheduling.render()

            //getFacesAuth(function (pk) {
                //ajaxGet("/faces/data?pk=" + pk.key, function (data) {
                    //scheduling.create(mainNode, data)
                //})
            //})
        }

        else if (path === "/measurements") {

            deactivateTabs()

            html.addClassTo("#navMeasurements", "active")
            html.clear(mainNode)

            console.log("TODO: finish measurement")
        }

        else if (path === "/admin") {

            deactivateTabs()

            html.addClassTo("#navAdmin", "active")
            html.clear(mainNode)

            //ajaxGet("/cgi-bin/disks.com", function (data) {
                //console.log("TODO: admin needs workd", disks.buildView(
                    //disks.preProcess(data)))
            //})
        }
    }

    function appendNode (node) {
        var x = document.getElementById(node.id)
        if (x !== null) x.appendChild(node.el)
    }

    function pathFrom (location) {
        return location.hash.slice(1)
    }
}

exports.suite = function (test, assert) {
    
    test("sanity", function () {
        assert.equals(true, true)
    })
}
