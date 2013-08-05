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

exports.create = function () {

    var d = new Date()
    var currentWeek = dates.weekNumber(d)[1]
    var day = d.getDay()
    var diff = d.getDate() - day + (day === 0 ? -6 : 1)
    var monday = new Date(d.setDate(diff))

    var calendarModel = WeekCalendar.modelFor(d.getFullYear(), d.getMonth())

    var calendarView = calendar.create(calendarModel, {
        send: function (x) {console.log("bus fired", x.data)}
    })

    var weekView = WeekView.create()

    var container = h.SECTION(
        h.H2(
            h.IMG({ src: "/images/icon-calendar.svg", class: "icon" }),
            h.SPAN({class: "section-title"}, "Schedule")),
        h.DIV({class: "flow" },
            h.DIV({class:"f-75"}, weekView.el),
            h.DIV({id: "navigator", class:"f-25"}, calendarView(
                d.getFullYear(), d.getMonth(), currentWeek))))

    return {el:container, render:render}

    function render (eventData) {
        weekView.render(separate(eventData))
    }
}

function separate (data) {

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

exports.suite = function (test, assert) {

    test("processing a single end-of-day event", function () {

        var event = {
             scanner: "40"
            ,start: "2013-07-20T09:00:00.000-0500"
            ,end: "2013-07-20T23:59:59.999-0500"
            ,account: "sterling_tgfb"
            ,comment: ""
            ,part: "full"
        }

        assert.equals(separate([event]), [event])
    })

    test("break a single multi day events into separate events", function () {

        var processedData = [//{{
             { 
                 scanner: "40"
                ,start: "2013-05-15T15:00:00.000-0500"
                ,end: "2013-05-16T06:00:00.000-0500"
                ,account: "fe_nasa"
                ,comment: "VBX"
                ,part: "full"
            }
        ] //}}

        var splitDays = separate(processedData)

        assert.equals(splitDays.length, 2)
        assert.equals(splitDays[0].start, "2013-05-15T15:00:00.000-0500")
        assert.equals(splitDays[0].end, "2013-05-15T23:59:59.999-0500")
        assert.equals(splitDays[0].part, "begin")
        assert.equals(splitDays[1].start, "2013-05-16T00:00:00.000-0500")
        assert.equals(splitDays[1].end, "2013-05-16T06:00:00.000-0500")
        assert.equals(splitDays[1].part, "end")
    })

    test("not spliting single day events", function () {

        var processedData = [//{{
            { 
                 scanner: "40"
                ,start: "2013-05-24T16:00:00.000-0500"
                ,end: "2013-05-24T17:00:00.000-0500"
                ,account: "fe_nf1"
                ,comment: "Jean nf1 col2 bone"
                ,part: "full"
            }
            ,{ 
                 scanner: "40"
                ,start: "2013-05-15T17:00:00.000-0500"
                ,end: "2013-05-16T06:00:00.000-0500"
                ,account: "fe_nasa"
                ,comment: "VBX"
                ,part: "full"
            }
            ,{ 
                 scanner: "40"
                ,start: "2013-06-07T16:00:00.000-0500"
                ,end: "2013-06-08T21:00:00.000-0500"
                ,account: "orear_plasmin"
                ,comment: ""
                ,part: "full"
            }
        ] //}}

        var splitDays = separate(processedData)

        assert.equals(splitDays.length, 5)
        assert.equals(splitDays[0].part, "full")
    })

    test("rendering", function () {
        console.log(exports.create().el)
    })
}

