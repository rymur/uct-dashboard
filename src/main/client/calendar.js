var lymphClient = require("lymph-client")
var lymphUtils = require("lymph-utils")

var arrays = lymphUtils.arrays

var h = lymphClient.html
var events = lymphClient.events

var dates = require("lymph-dates").dates

var monthNames = ["January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"]

var dayNames = ["Sun", "Mon", "Tue", "Wed", "Thr", "Fri", "Sat"]

exports.view = function (year, month, week) {
    var model = exports.modelFor(year, month)
    var tbody = h.TBODY(exports.tableBody(model, week))

    var tbl = h.TABLE({class:"calendar"},
        tableCaption(year, month),
        h.THEAD(calDaysOfWeek(dayNames)), tbody)

    events.add(tbl, "click", function (t) {
        switch (t.target.id) {
            case "cal-next":
                events.trigger(tbl, events.custom("changed", {dir: "next"}))
                h.clear(tbody)
                month = month + 1
                arrays.each(appendChild(tbody), exports.tableBody(
                    exports.modelFor(year, month), week))
                break
            case "cal-prev": 
                events.trigger(tbl, events.custom("changed", {dir: "next"}))
                h.clear(tbody)
                month = month - 1
                arrays.each(appendChild(tbody), exports.tableBody(
                    exports.modelFor(year, month), week))
                break
        }
    })

    return tbl
}

function appendChild (parent) {
    return function (child) {
        parent.appendChild(child)
    }
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

exports.tableRow = function (days, isCurrent) {
    var attributes = (isCurrent) ? {class:"current"} : {}
    return h.TR(attributes, arrays.map(function (d) {
        return h.TD(d)
    }, days))
}

exports.tableBody = function (weeks, current) {
    return arrays.map(function (days) {
        return exports.tableRow(days, current)
    }, weeks)
}

function tableCaption (year, month) {
    return h.CAPTION(h.SPAN({id:"cal-prev"}, "<"),
                     h.SPAN(monthNames[month] + " " + year),
                     h.SPAN({id:"cal-next"}, ">"))
}

function adjustDayOfWeek (jsDayOfWeek) {
    return jsDayOfWeek === 0 ? 7 : jsDayOfWeek
}

function calDaysOfWeek (names) {
    return h.TR(arrays.map(function (n) {
        return h.TH(n)
    }, names))
}

