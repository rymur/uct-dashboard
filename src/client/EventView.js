var _ = exports

var lymphClient = require("lymph-client")
var lymphUtils  = require("lymph-utils")

var utils = lymphUtils.utils
var arrays = lymphUtils.arrays
var html = lymphClient.html

var WeekCalendar = require("./weekCalendar")

_.eventNode = function (event) {

    var sd = new Date(event.start)
    var ed = new Date(event.end)

    var node = html.DIV(
        {class:"event-" + event.scanner + " " + event.part}, event.account)

    node.style.top = (((sd.getHours() * 20) + 2)) + "px"
    node.style.height = ((WeekCalendar.hourDiff(ed, sd) * 20) - 7) + "px"

    return { id:WeekCalendar.dateId(sd), el:node }
}

_.appendNode = function (node) {
    var x = document.getElementById(node.id)
    if (x !== null) x.appendChild(node.el)
}

