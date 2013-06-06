lymph.define("scheduling", function (require) {
    
    var u = require("lymph-core/utils")
    var d = require("lymph-core/dates")
    var h = require("lymph-client/html")

    return u.expose(buildView, process, buildTimeSlotLabels)

    function buildView (startDate, data) {
        var md = mondayDate(startDate)
        return h.SECTION(
            h.HEADER(
                h.I({ class: "icon-calendar" }),
                h.SPAN("Schedule")
            ),
            buildTimeSlotLabels(),
            daySlots(md).map(buildDateView)
        )
    }

    function buildTimeSlotLabels () {
        console.log("foo")
        return h.DIV({ class: "day-label" },
            h.DIV(h.space),
            timeSlots().map(function (time) {
                return h.DIV({ class: isHalfHour(time) ? "half" : "hour" }, formatTimeSlotLabel(time))
            })
        )
    }

    function buildTimeLabelView () {
        return h.DIV({ class: "day" },
            [h.DIV(h.space)].concat(timeSlots().map(buildTimeLabelItemView))
        )
    }

    function buildDateView (date) {
        return h.DIV({ class: "day", dataDate: date },
            [buildDateTitleView(date)].concat(timeSlots().map(buildTimeView))
        )
    }

    function buildDateTitleView (date) {
        return h.DIV({ class: "" }, d.translateDay(date.getDay()))
    }

    function buildTimeLabelItemView (time) {
        return h.DIV({ class:"time", dataTime: time }, time)
    }

    function buildTimeView (time) {
        return h.DIV({ class:"time", dataTime: time }, h.space)
    }

    function extractComment (data) {
        return data.slice(data.indexOf(" ", 43)).trim()
    }

    function mondayDate(startDate) {
        var d = new Date(startDate)
        var day = d.getDay()
        var diff = d.getDate() - day + (day == 0 ? -6 : 1)
        return new Date(d.setDate(diff))
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
        for (var i = 1; i <= 24; i++) {
            slots.push(i + ":00")
            slots.push(i + ":30")
        }
        return slots
    }

    function extractFields (data) {
        var fields = data.split(" ")
        var comment = extractComment(data)
        return {
            scanner: fields[0],
            startDate: fields[1],
            startTime: fields[2],
            start: new Date(fields[1] + " " + fields[2]).toString(),
            endDate:   fields[3],
            endTime:   fields[4],
            end: new Date(fields[3] + " " + fields[4]).toString(),
            account:   fields[5],
            comment: comment,
            title: fields[5] + ": " + comment,
            allDay: false,
            backgroundColor: "blue"
        }
    }

    function dataFromLine (line) {
        return line.split("|")[0]
    }

    function process (rawData) {
        return rawData.split("\n").map(dataFromLine).map(extractFields)
    }

    function humanHour (h) {
        return h % 12 || 12
    }

    function leadingZeroHour (h) {
        return (h < 10) ? "0" + h : " " + h
    }

    function attachAmPM (h) {
        return (h < 12) ? h + "am" : h + "pm"
    }

    function parseTime (time) {
        var t = time.split(":")
        return { h: t[0], m: t[1] }
    }

    function isHalfHour (time) {
        return parseTime(time).m == "30"
    }

    function formatTimeSlotLabel (time) {
        var t = parseTime(time)
        if (t.m == "30") {
            return h.space
        }
        else {
            return attachAmPM(humanHour(t.h))
        }
    }

})

