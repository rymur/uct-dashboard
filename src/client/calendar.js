var _ = exports

var lymphClient = require("lymph-client")
var lymphUtils = require("lymph-utils")

var f = lymphUtils.utils
var arrays = lymphUtils.arrays
var objects = lymphUtils.objects

var h = lymphClient.html
var events = lymphClient.events

var dates = require("lymph-dates").dates

var monthNames = ["January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"]

var dayNames = ["Mon", "Tue", "Wed", "Thr", "Fri", "Sat", "Sun"]

_.create = function (calendarModel, bus) {

    var tcaption = h.CAPTION("")
    var thead = h.THEAD(calDaysOfWeek(dayNames))
    var tbody = h.TBODY({})
    var tbl = h.TABLE({class:"calendar"}, tcaption, thead, tbody)

    events.add(tbl, "click", function (t) {
        if (t.target.id === "cal-next" || t.target.id === "cal-prev") {

            var event = changedEvent(
                t.target.id, t.target.getAttribute("data-month"))

            h.clear(tbody)

            var weekNum = dates.weekNumber(
                new Date(event.data.year, event.data.month, 1))[1]

            render (event.data.year, event.data.month, weekNum)

            bus.send(event)
        }
        else if (t.target.hasAttribute("data-week")){
            h.removeClass("active", tbl.querySelector("tr.active"))
            h.addClass("active", t.target.parentElement)
            bus.send({
                 name:"calendar:selected"
                ,data: t.target.getAttribute("data-week")
            })
        }
    })

    return render

    function render (year, month, weekNum) {

        h.clear(tcaption)

        arrays.each(function (x) {
            tcaption.appendChild(x)
        }, _.title(year, month))

        h.clear(tbody)

        var monthModel = arrays.find(isMonth(month), calendarModel)

        arrays.each(function (x) {
            tbody.appendChild(x)
        }, _.tableRows(monthModel, weekNum))

        return tbl
    }

    function parseDate (date) {
        var xs = date.split(":")
        return {
             year: xs[0]
            ,month: xs[1]
            ,week: xs[2]
        }
    }

    function isMonth (month) {
        return function (x) {
            return x.month === month
        }
    }
}

_.tableRow = function (monthModel, weekNum, currentWeek) {

    var trAttributes = (currentWeek.num === weekNum) ? {class:"active"} : {}

    var tdAttributes = {
        dataWeek: monthModel.year + ":" + monthModel.month + ":" + currentWeek.num
    }

    return h.TR(trAttributes, arrays.map(function (monthDate) {
        return h.TD(tdAttributes, monthDate)
    }, currentWeek.days))
}

_.tableRows = function (monthModel, weekNum) {
    return arrays.map(
        f.partial(_.tableRow, monthModel, weekNum), monthModel.weeks)
}

_.title = function (year, month) {
    return [
         h.SPAN(attributes("cal-prev"), "<")
        ,h.SPAN(monthNames[month], " " + year)
        ,h.SPAN(attributes("cal-next"), ">")
    ]

    function attributes(id) {
        return {id: id, dataMonth: year + ":" + month}
    }
}

function calDaysOfWeek (names) {
    return h.TR(arrays.map(function (n) {
        return h.TH(n)
    }, names))
}

function changedEvent (id, monthData) {

    switch (id) {
        case "cal-next": return {
             name: "calendar:next"
            ,data: createData(monthData, function (x) { return x + 1 })
        }
        case "cal-prev": return {
             name: "calendar:prev"
            ,data: createData(monthData, function (x) { return x - 1 })
        }
    }

    function createData (monthData, modFn) {
        var xs = monthData.split(":")
        return { year: toInt(xs[0]) ,month: modFn(toInt(xs[1])) }
    }

    function toInt (s) {
        return parseInt(s, 10)
    }
}

exports.suite = function (test, assert) {

    var monthModel = {
         year: 2013
        ,month: 1
        ,weeks: [
             {num:1, days:[0,0,0,0,0,0,0]}
            ,{num:2, days:[0,0,0,0,0,0,0]}
            ,{num:3, days:[0,0,0,0,0,0,0]}
            ,{num:4, days:[0,0,0,0,0,0,0]}
            ,{num:5, days:[0,0,0,0,0,0,0]}
            ,{num:6, days:[0,0,0,0,0,0,0]}
        ]
    }

    test("create a table styled row for a given week model", function () {
        var row = exports.tableRow(monthModel, 1, monthModel.weeks[0])
        assert.equals(row.className, "active")
        assert.equals(row.childNodes.length, 7)
        assert.equals(row.childNodes[0].tagName, "TD")
        assert.equals(row.childNodes[0].getAttribute("data-week"), "2013:1:1")
    })

    test("create an array of table rows for a given array of week models", function () {

        var weekNum = 1
        var rows = exports.tableRows(monthModel, weekNum)

        assert.equals(rows.length, 6)
        assert.equals(rows[0].tagName, "TR")
    })

    test("create a calendar title for given year and month", function () {

        var title = exports.title(2013, 5)

        assert.equals(title.length, 3)
        assert.equals(title[0].id, "cal-prev")
        assert.equals(title[0].getAttribute("data-month"), "2013:5")
        assert.equals(title[1].innerHTML, "June 2013")
        assert.equals(title[2].id, "cal-next")
        assert.equals(title[2].getAttribute("data-month"), "2013:5")
    })

}

