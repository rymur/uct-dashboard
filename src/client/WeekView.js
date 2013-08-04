var _ = exports

var lymphClient = require("lymph-client")
var lymphUtils  = require("lymph-utils")
var lymphDates  = require("lymph-dates")

var utils = lymphUtils.utils
var arrays = lymphUtils.arrays

var dates = lymphDates.dates
var html = lymphClient.html

var WeekCalendar = require("./weekCalendar")

_.create = function () {

    var sd = WeekCalendar.startDate(2013, 7)

    var container = html.DIV({class:"f-75"},
        _.weekColLabels(sd), _.weekRowLabels, _.weekCells(sd))

    return container
}

_.divs = function (top, attrFn, childenFn) {
    return arrays.map(function (x) {
        return html.DIV(attrFn(x), childenFn(x))
    }, arrays.range(0, top))
}

_.cols = utils.partial(_.divs, 7)

_.rows = utils.partial(_.divs, 24)

_.dayLabel = function (initialDate) {
    return function (day) {
        var od = dates.addDays(initialDate, day)
        return dates.dayName((day === 6) ? 0 : day + 1) +
            " " + (od.getMonth() + 1) + "/" + od.getDate()
    }
}

_.hourLabel = utils.compose(html.SPAN, dates.humanHour)

_.weekCells = function (date) {
    return _.cols(
        colAttr, utils.partial(_.rows, _.staticAttr({class:"time"}), html.space))

    function colAttr(x) {
        var od = dates.addDays(date, x)
        return {id:WeekCalendar.dateId(od), class:"day"}
    }
}

_.staticAttr = function (x) {
    return function () {
        return x
    }
}

_.weekRowLabels = html.DIV({class:"day-label"},
    _.rows(_.staticAttr({class:"hour"}), _.hourLabel))

_.weekColLabels = function (date) {
    return html.DIV({class:"week-col-label"},
        html.DIV({class:"day-title"}, html.space()),
        _.divs(7, _.staticAttr({class:"day-title"}), _.dayLabel(date)))
}

exports.suite = function (test, assert) {

    test("create a set of divs column for each day of the week", function () {
        var attr = exports.staticAttr({class:"foo"})
        var r1 = exports.cols(attr, function (x) { return "" })
        assert.equals(r1.length, 7)
        assert.equals(r1[0].tagName, "DIV")
        assert.equals(r1[0].className, "foo")
        assert.equals(r1[0].innerHTML, "")
    })

    test("creates a set of divs for each hour of a day", function () {
        var attr = exports.staticAttr({class:"foo"})
        var r1 = exports.rows(attr, function (x) { return "" })
        assert.equals(r1.length, 24)
        assert.equals(r1[1].tagName, "DIV")
        assert.equals(r1[1].className, "foo")
        assert.equals(r1[1].innerHTML, "")
    })

    test("create an hour label", function () {
        var r1 = exports.hourLabel(1)
        assert.equals(r1.innerHTML, "1am")
        assert.equals(r1.tagName, "SPAN")
    })
}

