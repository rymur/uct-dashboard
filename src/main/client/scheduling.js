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

        if (e.account === "sterling_tgfb") {
            console.log(new Date(e.start), new Date(e.end))
        }

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

