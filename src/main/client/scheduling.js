lymph.define("scheduling", function (require) {
    
    var h = require("lymph-client/html")

    return {
        buildView: buildView, process: process
    }

    function buildView (startDate, data) {
        return h.SECTION(daySlots().map(buildDayView))
    }

    function buildDayView (day) {
        return h.DIV({ class:"day", dataDate: day }, timeSlots().map(buildTimeView))
    }

    function buildTimeView (time) {
        return h.DIV({ class:"time", dataTime: time })
    }

    function extractComment (data) {
        return data.slice(data.indexOf(" ", 43)).trim()
    }

    function daySlots (startDate) {
        var days = []
        for (var i = 0; i < 7; i++) {
            days.push(startDate)
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
})

