var lymphUtils = require("lymph-utils")

var arrays = lymphUtils.arrays

var h = require("lymph-client").html
var dates = require("lymph-dates").dates

var monthNames = ["January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"]

var dayNames = ["Sun", "Mon", "Tue", "Wed", "Thr", "Fri", "Sat"]

exports.generateView = function (year, month) {
    var model = exports.modelFor(year, month)
    return h.TABLE(
        tableCaption(year, month),
        h.THEAD(calDaysOfWeek(dayNames)),
        exports.tableBody(model))
}

exports.modelFor = function (year, month) {
    var sd = exports.startDate(year, month)
    var weeks = []
    var days = []
    var count = 0

    // TODO: refactor this to be more functional
    for (var x = 0; x < 6; x++) {
        days = []
        for (var y = 0; y < 7; y++) {
            days.push(dates.addDays(sd, count++).getDate())
        }
        weeks.push(days)    
    }

    return weeks
}

exports.startDate = function (year, month) {
    var currStartDayOfWeek = adjustDayOfWeek(new Date(year, month, 1).getDay())
    var prevLastDate = new Date(year, month, 0).getDate()
    var correctedPrevLastDate = prevLastDate - (currStartDayOfWeek - 2)
    return new Date(year, month - 1, correctedPrevLastDate)
}

exports.tableRow = function (days) {
    return h.TR(arrays.map(function (d) {
        return h.TD(d)
    }, days))
}

exports.tableBody = function (weeks) {
    return h.TBODY(arrays.map(function (days) {
        return exports.tableRow(days)
    }, weeks))
}

function tableCaption (year, month) {
    return h.CAPTION(h.SPAN({id:"calPrev"}, "<"),
                     h.SPAN(monthNames[month] + " " + year),
                     h.SPAN({id:"calNext"}, ">"))
}

function adjustDayOfWeek (jsDayOfWeek) {
    return jsDayOfWeek === 0 ? 7 : jsDayOfWeek
}

function calDaysOfWeek (names) {
    return h.TR(arrays.map(function (n) {
        return h.TH(n)
    }, names))
}

