var lymphClient = require("lymph-client")
var lymphUtils  = require("lymph-utils")
var lymphDates  = require("lymph-dates")
var WeekCalendar = require("./weekCalendar")

var utils = lymphUtils.utils
var arrays = lymphUtils.arrays

var dates = lymphDates.dates
var html = lymphClient.html

var cols = utils.partial(divs, 7)
var rows = utils.partial(divs, 24)
var hourLabel = utils.compose(html.SPAN, dates.humanHour)

var weekRowLabels = html.DIV({class:"day-label"},
    rows(staticAttr({class:"hour"}), hourLabel))

exports.create = function () {
    
    var sd = WeekCalendar.startDate(2013, 7)

    var container = html.DIV({class:"f-75"},
        weekColLabels(sd), weekRowLabels, weekCells(sd))

    return {el:container, render:render}

    function render (data, sd) {
        html.clear(container)

        container.appendChild(weekColLabels(sd))
        container.appendChild(weekRowLabels)

        arrays.each(function (x) {
            container.appendChild(x)
        }, weekCells(sd))

        arrays.each(appendNode, arrays.map(eventNode, data))
    }
}

function divs (top, attrFn, childenFn) {
    return arrays.map(function (x) {
        return html.DIV(attrFn(x), childenFn(x))
    }, arrays.range(0, top))
}

function dayLabel (initialDate) {
    return function (day) {
        var od = dates.addDays(initialDate, day)
        return dates.dayName((day === 6) ? 0 : day + 1) +
            " " + (od.getMonth() + 1) + "/" + od.getDate()
    }
}

function weekCells (date) {
    return cols(
        colAttr, utils.partial(rows, staticAttr({class:"time"}), html.space))

    function colAttr(x) {
        var od = dates.addDays(date, x)
        return {id:WeekCalendar.dateId(od), class:"day"}
    }
}

function staticAttr (x) {
    return function () {
        return x
    }
}

function weekColLabels (date) {
    return html.DIV({class:"week-col-label"},
        html.DIV({class:"day-title"}, html.space()),
        divs(7, staticAttr({class:"day-title"}), dayLabel(date)))
}

function eventNode (event) {

    var sd = new Date(event.start)
    var ed = new Date(event.end)

    var node = html.DIV(
        {class:"event-" + event.scanner + " " + event.part}, event.account)

    node.style.top = (((sd.getHours() * 20) + 2)) + "px"
    node.style.height = ((WeekCalendar.hourDiff(ed, sd) * 20) - 7) + "px"

    return { id:WeekCalendar.dateId(sd), el:node }
}

function appendNode (node) {
    var x = document.getElementById(node.id)
    if (x !== null) x.appendChild(node.el)
}

exports.suite = function (test, assert) {

    test("create a set of divs column for each day of the week", function () {
        var attr = staticAttr({class:"foo"})
        var r1 = cols(attr, function (x) { return "" })
        assert.equals(r1.length, 7)
        assert.equals(r1[0].tagName, "DIV")
        assert.equals(r1[0].className, "foo")
        assert.equals(r1[0].innerHTML, "")
    })

    test("creates a set of divs for each hour of a day", function () {
        var attr = staticAttr({class:"foo"})
        var r1 = rows(attr, function (x) { return "" })
        assert.equals(r1.length, 24)
        assert.equals(r1[1].tagName, "DIV")
        assert.equals(r1[1].className, "foo")
        assert.equals(r1[1].innerHTML, "")
    })

    test("create an hour label", function () {
        var r1 = hourLabel(1)
        assert.equals(r1.innerHTML, "1am")
        assert.equals(r1.tagName, "SPAN")
    })
}

