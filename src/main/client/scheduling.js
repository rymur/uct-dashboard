var lymphClient = require("lymph-client")
var lymphUtils = require("lymph-utils")

var h = require("lymph-client").html
var dates = require("lymph-dates").dates

var u = lymphUtils.utils
var arrays = lymphUtils.arrays

var WeekCalendar = require("./weekCalendar")
var WeekView = require("./WeekView")
var EventView = require("./EventView")
var calendar = require("./calendar")

exports.render = function (mainNode, eventData) {

    var d = new Date()
    var currentWeek = dates.weekNumber(d)[1]
    var day = d.getDay()
    var diff = d.getDate() - day + (day === 0 ? -6 : 1)
    var monday = new Date(d.setDate(diff))

    var calendarModel = WeekCalendar.modelFor(d.getFullYear(), d.getMonth())

    var calendarView = calendar.create(calendarModel, {
        send: function (x) {console.log("bus fired", x.data)}
    })

    mainNode.appendChild(h.SECTION(
        h.H2(
            h.IMG({ src: "/images/icon-calendar.svg", class: "icon" }),
            h.SPAN({class: "section-title"}, "Schedule")),
        h.DIV({class: "flow" },
            h.DIV({class:"f-75"}, WeekView.create()),
            h.DIV({id: "navigator", class:"f-25"}, calendarView(
                d.getFullYear(), d.getMonth(), currentWeek)))))

    arrays.each(EventView.appendNode,
        arrays.map(EventView.eventNode, exports.separate(eventData)))
}

exports.separate = function (data) {

    var separatedData = []

    data.forEach(function (e) {
        if (isMultiday(e)) {
            separatedData = separatedData.concat(splitByDays(e))
        }
        else {
            separatedData.push(e)
        } 
    })

    return separatedData

    function splitByDays (e) {
        var days = []
        var firstDay = new Date(e.start).getDate()
        var lastDay = new Date(e.end).getDate()

        for (var i = firstDay; i <= lastDay; i++) {

            if (i == firstDay) {
                days.push(eventWithDates(e,
                    e.start,
                    endOfDayFor(e.start, i),
                    "begin"))
            }
            else if (i == lastDay) {
                days.push(eventWithDates(e,
                    startOfDayFor(e.start, i),
                    e.end,
                    "end"))
            }
            else {
                days.push(eventWithDates(e,
                    startOfDayFor(e.start, i),
                    endOfDayFor(e.start, i), "middle"))
            }
        }
        return days 
    }

    function isMultiday (e) {
        return new Date(e.start).getDate() !== new Date(e.end).getDate()
    }

    function toISODate (y, mo, d, h, m, s, ms) {
        var date = y + "-" + mo + "-" + d
        var time = h + ":" + m  + ":" + s + "." + ms
        return date + "T" + time + "-0500"
    }

    function endOfDayFor(date, da) {
        var yy = padZero(new Date(date).getFullYear())
        var mo = padZero(new Date(date).getMonth() + 1)
        return toISODate(yy, mo, padZero(da), "23", "59", "59", "999")
    }

    function startOfDayFor(date, da) {
        var yy = padZero(new Date(date).getFullYear())
        var mo = padZero(new Date(date).getMonth() + 1)
        return toISODate(yy, mo, padZero(da), "00", "00", "00", "000")
    }

    function eventWithDates (e, start, end, part) {
        return {
             scanner: e.scanner
            ,start: start
            ,end: end
            ,account: e.account
            ,comment: e.comment
            ,part: part
        }
    }

    function padZero (num) {
        return num <= 9 ? "0"+num : num
    }
}

