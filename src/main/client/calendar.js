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

var dayNames = ["Sun", "Mon", "Tue", "Wed", "Thr", "Fri", "Sat"]

exports.create = function (bus) {

    var model = null
    var title = h.SPAN("")

    var tcaption = h.CAPTION(
         h.SPAN({id:"cal-prev"}, "<")
        ,title
        ,h.SPAN({id:"cal-next"}, ">"))

    var thead = h.THEAD(calDaysOfWeek(dayNames))
    var tbody = h.TBODY({})
    var tbl = h.TABLE({class:"calendar"}, tcaption, thead, tbody)

    events.add(tbl, "click", function (t) {
        if (t.target.id === "cal-next" || t.target.id === "cal-prev") {
            var event = changedEvent(t.target.id, model)
            h.clear(tbody)
            render (event.data[0], event.data[1], event.data[2])
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

    function render (year, month, currentWeek) {
        model = exports.modelFor(year, month, currentWeek)
        console.log(model)
        title.innerHTML = tableCaption(model.year, model.month)

        arrays.each(function (x) {
            tbody.appendChild(x)
        }, exports.daysView(model))

        return tbl
    }
}

exports.daysView = function (model) {
    return objects.values(exports.tableBody(model.weeks, model.currentWeek))
}

exports.modelFor = function (year, month, week) {
    var sd = exports.startDate(year, month)
    var startWeekNumber = parseInt(dates.weekNumber(sd)[1], 10)
    var model = {
         year: year
        ,month: month
        ,currentWeek: week
        ,weeks: []
    }
    var days = []
    var count = 0

    // TODO: refactor this to be more functional
    for (var x = 0; x < 6; x++) {
        days = []
        for (var y = 0; y < 7; y++) {
            days.push(dates.addDays(sd, count++).getDate())
        }
        model.weeks.push({num: startWeekNumber + x, days: days})
    }

    return model
}

exports.startDate = function (year, month) {
    var currStartDayOfWeek = adjustDayOfWeek(new Date(year, month, 1).getDay())
    var prevLastDate = new Date(year, month, 0).getDate()
    var correctedPrevLastDate = prevLastDate - (currStartDayOfWeek - 2)
    return new Date(year, month - 1, correctedPrevLastDate)
}

exports.tableRow = function (week, current) {
    return h.TR(attr(week.num, current), arrays.map(function (y) {
        return h.TD({dataWeek: week.num}, y)
    }, week.days))


    function attr (num, current) {
        return num === current ? {class:"active"} : {}
    }
}

exports.tableBody = function (weeks, current) {
    return arrays.map(function (w) {
        return exports.tableRow(w, current)
    }, weeks)
}

function tableCaption (year, month) {
    return monthNames[month] + " " + year
}

function adjustDayOfWeek (jsDayOfWeek) {
    return jsDayOfWeek === 0 ? 7 : jsDayOfWeek
}

function calDaysOfWeek (names) {
    return h.TR(arrays.map(function (n) {
        return h.TH(n)
    }, names))
}

function changedEvent (id, model) {
    switch (id) {
        case "cal-next": return {
             name: "calendar:next"
            ,data: [ model.year, model.month + 1, model.currentWeek ]
        }
        case "cal-prev": return {
             name: "calendar:prev"
            ,data: [ model.year, model.month - 1, model.currentWeek ]
        }
    }
}

