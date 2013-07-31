var _ = exports

var lymphUtils = require("lymph-utils")
var lymphDates = require("lymph-dates")

var utils  = lymphUtils.utils
var arrays = lymphUtils.arrays
var dates  = lymphDates.dates

_.modelFor = function (year, month) {
    return arrays.map(
        utils.partial(_.buildMonth, year, month), arrays.range(-6, 6))
}

_.startDate = function (year, month) {
    var firstDayOfWeek = _.adjustSundays(new Date(year, month, 1).getDay())
    var lastDateOfPrevMonth = new Date(year, month, 0).getDate()

    return new Date(
        year, month - 1, lastDateOfPrevMonth - (firstDayOfWeek - 2))
}

_.adjustSundays = function (day) {
    return day === 0 ? 7 : day
}

_.buildMonth = function (year, month, offset) {
    var firstOfMonth = new Date(year, month, 1)
    var offsetted = dates.addMonths(firstOfMonth, offset)
    return {
         year: offsetted.getFullYear() 
        ,month: offsetted.getMonth()
        ,weeks: _.buildWeeks(offsetted.getFullYear(), offsetted.getMonth())
    }
}

_.buildWeeks = function (year, month) {

    var sd = _.startDate(year, month)
    var firstWeekNumber = parseInt(dates.weekNumber(sd)[1], 10)
    var count = 0

    var days = []
    var weeks = []

    for (var x = 0; x < 6; x++) {
        days = []
        for (var y = 0; y < 7; y++) {
            days.push(dates.addDays(sd, count++).getDate())
        }
        weeks.push({num: firstWeekNumber + x, days: days})
    }

    return weeks
}

