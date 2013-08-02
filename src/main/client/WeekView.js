var _ = exports

var lymphClient = require("lymph-client")
var lymphUtils  = require("lymph-utils")
var lymphDates  = require("lymph-dates")

var utils = lymphUtils.utils
var arrays = lymphUtils.arrays

var dates = lymphDates.dates
var html = lymphClient.html

_.divs = function (top, attr, fn) {
    return arrays.map(function (x) {
        return html.DIV(attr, fn(x))
    }, arrays.range(0, top))
}

_.humanHour = function (hourIndex) {
    return (hourIndex % 12 || 12) + ((hourIndex < 12) ? "am" : "pm")
}

_.dayLabel = function (initialDate) {
    return function (day) {
        var od = dates.addDays(initialDate, day)
        return dates.dayName((day === 6) ? 0 : day + 1) +
            " " + (od.getMonth() + 1) + "/" + od.getDate()
    }
}

_.cols = utils.partial(_.divs, 7)

_.rows = utils.partial(_.divs, 24)

_.hourLabel = utils.compose(html.SPAN, _.humanHour)

_.weekCells = _.cols(
    {class:"day"}, utils.partial(_.rows, {class:"time"}, html.space))

_.weekRowLabels = html.DIV(
    {class:"day-label"}, _.rows({class:"hour"}, _.hourLabel))

_.weekColLabels = function (date) {
    return html.DIV({class:"week-col-label"},
        html.DIV({class:"day-title"}, html.space()),
        _.divs(7, {class:"day-title"}, _.dayLabel(date)))
}

