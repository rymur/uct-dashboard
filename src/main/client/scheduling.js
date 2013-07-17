var u = require("lymph-utils").utils
var h = require("lymph-client").html
var d = require("lymph-dates").dates

exports.buildView = function (mainEl, startDate, data) {

    var d = new Date(startDate.getFullYear(), startDate.getMonth(),
        startDate.getDate())

    var day = d.getDay()
    var diff = d.getDate() - day + (day === 0 ? -6 : 1)
    var monday = new Date(d.setDate(diff))

    var view =  h.SECTION(
        h.HEADER(
            h.I({ class: "icon-calendar" }),
            h.SPAN("Schedule")
        ),
        exports.timeSlotLabels(),
        exports.daySlotColumns(monday)
    )

    mainEl.append(view)

    data.forEach(function (e) {
        var startDate = new Date(e.start)
        var endDate = new Date(e.end)
        var day = document.getElementById(dateId(startDate))

        if (day !== null) {

            var ediv = h.DIV({ class: "event-" + e.scanner + " " + e.part },
                e.account)

            var startHour = startDate.getHours()
            var startPOS = ((startHour * 20) + 2) + 20

            ediv.style.top = startPOS + "px"
            ediv.style.height = ((hourDiff(endDate, startDate) * 20) - 7) + "px"
            day.appendChild(ediv)
        }
    })

    return view
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

exports.timeSlotLabels = function () {

    function humanHour (h) {
        return h % 12 || 12
    }

    function getAMPM (h) {
        return (h < 12) ? "am" : "pm"
    }

    function parseTime (time) {
        var t = time.split(":")
        return { h: t[0], m: t[1] }
    }

    function formatTimeSlotLabel (time) {
        var t = parseTime(time)
        return (t.m == "30") ? h.space() : humanHour(t.h) + getAMPM(t.h)
    }

    function timeSlotLabelsItem (time) {
        return h.DIV({ class: "hour" }, formatTimeSlotLabel(time))
    }

    return h.DIV({ class: "day-label" },
        h.DIV(h.space()),
        timeSlots().map(timeSlotLabelsItem)
    )
}

exports.daySlotColumns = function (monday) {

    function formatDaySlotLabel (date) {
        var dw = d.translateDay(date.getDay())
        var mo = (date.getMonth() + 1)
        var da = date.getDate()
        return dw + " " + mo + "/" + da
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

    return daySlots(monday).map(daySlotRows)
}

function daySlots (startDate) {
    var days = []
    for (var i = 0; i < 7; i++) {
        days.push(d.addDays(startDate, i))
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
        var d1 = new Date(e.start)
        var d2 = new Date(e.end)
        var firstDay = d1.getDate()
        var lastDay = d2.getDate()

        for (var i = firstDay; i <= lastDay; i++) {

            var event = {
                scanner: e.scanner,
                start: e.start,
                end: e.end,
                account: e.account,
                comment: e.comment,
                part: e.part
            }

            if (i == firstDay) {
                event.end = new Date(new Date(d1.getFullYear(),
                    d1.getMonth(), i, 24, 0, 0, 0) - 1)

                event.part = "begin"
            }
            else if (i == lastDay) {
                event.start = new Date(d1.getFullYear(),
                    d1.getMonth(), i, 0, 0, 0, 0)

                event.part = "end"
            }
            else {
                event.start = new Date(d1.getFullYear(),
                    d1.getMonth(), i, 0, 0, 0, 0)
                event.end = new Date(d1.getFullYear(),
                    d1.getMonth(), i, 24, 0, 0, 0)

                event.part = "middle"
            }

            days.push(event)
        }
        return days 
    }

    function isMultiday (e) {
        var sd = new Date(e.start)
        var ed = new Date(e.end)
        return sd.getDate() !== ed.getDate()
    }
}

