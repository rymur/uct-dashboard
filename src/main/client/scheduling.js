var u = require("lymph-utils").utils
var h = require("lymph-client").html
var dates = require("lymph-dates").dates

var calendar = require("./calendar")

exports.buildCalendar = function (startDate) {

    var d = new Date(startDate.getFullYear(), startDate.getMonth(),
        startDate.getDate())

    var currentWeek = dates.weekNumber(d)[1]
    var day = d.getDay()
    var diff = d.getDate() - day + (day === 0 ? -6 : 1)
    var monday = new Date(d.setDate(diff))

    var calendarView = calendar.create({
        send: function (x) {console.log("bus fired", x.data)}
    })

    return h.SECTION(
        h.H2(
            h.IMG({ src: "/images/icon-calendar.svg", class: "icon" }),
            h.SPAN({class: "section-title"}, "Schedule")),
        h.DIV({class: "flow" },
            h.DIV({class:"f-75"},
                exports.timeSlotLabels(),
                exports.daySlotColumns(monday)),
            h.DIV({id: "navigator", class:"f-25"}, calendarView(
                d.getFullYear(), d.getMonth(), currentWeek))))
}

exports.eventNodes = function (data) {

    var view = []

    data.forEach(function (e) {

        var startDate = new Date(e.start)
        var endDate = new Date(e.end)
        var ediv = h.DIV({ class: "event-" + e.scanner + " " + e.part },
            e.account)

        var startHour = startDate.getHours()
        var startPOS = ((startHour * 20) + 2) + 20

        ediv.style.top = startPOS + "px"
        ediv.style.height = ((hourDiff(endDate, startDate) * 20) - 7) + "px"

        view.push({id:dateId(startDate), el:ediv})
    })

    return view
}

exports.timeSlotLabels = function () {

    var splitTime = u.splitOn(":")

    return h.DIV({ class: "day-label" },
        h.DIV(h.space()),
        timeSlots().map(timeSlotLabelsItem))

    function humanHour (h) {
        return h % 12 || 12
    }

    function getAMPM (h) {
        return (h < 12) ? "am" : "pm"
    }

    function parseTime (t) {
        return { h: t[0], m: t[1] }
    }

    function formatTimeSlotLabel (time) {
        var t = parseTime(splitTime(time))
        return (t.m == "30") ? h.space() : humanHour(t.h) + getAMPM(t.h)
    }

    function timeSlotLabelsItem (time) {
        return h.DIV({ class: "hour" }, formatTimeSlotLabel(time))
    }
}

exports.daySlotColumns = function (monday) {

    return daySlots(monday).map(daySlotRows)

    function formatDaySlotLabel (date) {
        return dates.translateDay(date.getDay()) + " " + (date.getMonth() + 1) +
            "/" + date.getDate()
    }

    function formatDaySlotData (date) {
        return date.getFullYear() + "" + date.getMonth() + "" + date.getDate()
    }

    function daySlotLabel (date) {
        return h.DIV({ class:"day-title" }, formatDaySlotLabel(date))
    }

    function daySlotRowsItem (time) {
        return h.DIV({ class:"time", dataTime: time }, h.space())
    }

    function daySlotRows (date) {
        return h.DIV({ class: "day", id: formatDaySlotData(date) },
            daySlotLabel(date),
            timeSlots().map(daySlotRowsItem)
        )
    }
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

function dateId (dt) {
    return dt.getFullYear() + "" + dt.getMonth() + "" + dt.getDate()
}

function hourDiff(date1, date2) {
    var h1 = date1.getHours()
    var h2 = date2.getHours()
    if (date1.getMinutes() > 0) {
        h1 = h1 + 1
    }
    return h1 - h2
}

function DateDiff(date1, date2) {
    var datediff = date1.getTime() - date2.getTime()
    return (datediff / (24*60*60*1000))
}

function daySlots (startDate) {
    var days = []
    for (var i = 0; i < 7; i++) {
        days.push(dates.addDays(startDate, i))
    }
    return days
}

function timeSlots () {
    var slots = []
    for (var i = 0; i <= 23; i++) {
        slots.push(i + ":00")
    }
    return slots
}
