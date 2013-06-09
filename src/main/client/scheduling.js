lymph.define("scheduling", function (require) {
    
    var u = require("lymph-core/utils")
    var d = require("lymph-core/dates")
    var h = require("lymph-client/html")

    return u.expose(buildView, process, timeSlotLabels, daySlotColumns)

    function buildView (startDate, data) {

        var d = new Date(startDate)
        var day = d.getDay()
        var diff = d.getDate() - day + (day == 0 ? -6 : 1)
        monday = new Date(d.setDate(diff))

        return h.SECTION(
            h.HEADER(
                h.I({ class: "icon-calendar" }),
                h.SPAN("Schedule")
            ),
            timeSlotLabels(),
            daySlotColumns(monday)
        )
    }

    function timeSlotLabels () {

        function humanHour (h) {
            return h % 12 || 12
        }

        function attachAmPM (h) {
            return (h < 12) ? h + "am" : h + "pm"
        }

        function parseTime (time) {
            var t = time.split(":")
            return { h: t[0], m: t[1] }
        }

        function formatTimeSlotLabel (time) {
            var t = parseTime(time)
            return (t.m == "30") ? h.space : attachAmPM(humanHour(t.h))
        }

        function isHalfHour (time) {
            return parseTime(time).m == "30"
        }

        function timeSlotLabelsItem (time) {
            return h.DIV({ class: isHalfHour(time) ? "half" : "hour" }, formatTimeSlotLabel(time))
        }

        return h.DIV({ class: "day-label" },
            h.DIV(h.space),
            timeSlots().map(timeSlotLabelsItem)
        )
    }

    function daySlotColumns (monday) {

        function formatDaySlotLabel (date) {
            var dw = d.translateDay(date.getDay())
            var mo = (date.getMonth() + 1)
            var da = date.getDate()
            return dw + " " + mo + "/" + da
        }

        function daySlotLabel (date) {
            return h.DIV(formatDaySlotLabel(date))
        }

        function daySlotRowsItem (time) {
            return h.DIV({ class:"time", dataTime: time }, h.space)
        }

        function daySlotRows (date) {
            return h.DIV({ class: "day" },
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
        for (var i = 1; i <= 24; i++) {
            slots.push(i + ":00")
            slots.push(i + ":30")
        }
        return slots
    }

    function process (rawData) {

        function extractComment (data) {
            return data.slice(data.indexOf(" ", 43)).trim()
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

        return rawData.split("\n").map(dataFromLine).map(extractFields)
    }
})

