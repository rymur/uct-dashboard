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
var WeekView = require("./WeekView")
var WeekCalendar = require("./weekCalendar")

exports.run = function () {

    var xhr = new XMLHttpRequest()
    var mainNode = document.getElementById("main")

    var getKey = f.partial(data.getKey, sessionStorage)
    var setKey = f.partial(data.setKey, sessionStorage)
    var ajaxGet = f.partial(ajax.get, xhr)
    var getFacesAuth = data.facesAuth(ajaxGet, getKey, setKey)

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

        var path = pathFrom(window.location)

        if (path === "/") {
            deactivateTabs()
            html.addClassTo("#navMeasurements", "active")
            html.clear(mainNode)
            console.log("TODO: finish measurement")
        }

        else if (path === "/scheduling") {
            deactivateTabs()
            html.addClassTo("#navScheduling", "active")
            html.clear(mainNode)
            ajaxGet("/faces-sample-data.json", function (data) {
                mainNode.appendChild(scheduling.buildCalendar(new Date()))
                arrays.each(appendNode, scheduling.eventNodes(
                    scheduling.separate(data)))
            })
            //getFacesAuth(function (pk) {
                //ajaxGet("/faces/data?pk=" + pk.key, function (data) {
                    //mainNode.appendChild(scheduling.buildCalendar(new Date()))
                    //arrays.each(appendNode, scheduling.eventNodes(
                        //scheduling.separate(data)))
                //})
            //})
        }

        else if (path === "/admin") {

            deactivateTabs()

            html.addClassTo("#navAdmin", "active")
            html.clear(mainNode)

            mainNode.appendChild(
                WeekView.weekColLabels(WeekCalendar.startDate(2013, 7)))

            mainNode.appendChild(WeekView.weekRowLabels)

            arrays.each(function (x) {
                mainNode.appendChild(x)
            }, WeekView.weekCells)

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

