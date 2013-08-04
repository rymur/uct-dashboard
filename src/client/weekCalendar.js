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

_.hourDiff = function (date1, date2) {
    var h1 = date1.getHours()
    var h2 = date2.getHours()
    if (date1.getMinutes() > 0) {
        h1 = h1 + 1
    }
    return h1 - h2
}

_.dateId = function (dt) {
    return dt.getFullYear() + "" + dt.getMonth() + "" + dt.getDate()
}

exports.suite = function (test, assert) {

    test("creates an array for 12 months of calendar data", function () {
        var r1 = exports.modelFor(2013, 7)

        assert.equals(r1.length, 12)
        assert.equals(r1[0].year, 2013)
        assert.equals(r1[0].month, 1)
        assert.equals(r1[0].weeks.length, 6)
    })

    test("gets the first calendar monday for a given year and month", function () {
        assert.equals(tds(exports.startDate(2013, 7)), "Mon Jul 29 2013")
        assert.equals(tds(exports.startDate(2013, 8)), "Mon Aug 26 2013")
        assert.equals(tds(exports.startDate(2013, 1)), "Mon Jan 28 2013")
    })

    test("creates a +/- month given a the year, a month & the 'step'", function () {
        var d1 = exports.buildMonth(2013, 7, -1)
        assert.equals(d1.year, 2013)
        assert.equals(d1.month, 6)

        var d2 = exports.buildMonth(2013, 7, 0)
        assert.equals(d2.year, 2013)
        assert.equals(d2.month, 7)

        var d3 = exports.buildMonth(2013, 7, 1)
        assert.equals(d3.year, 2013)
        assert.equals(d3.month, 8)
    })

    test("creates an array of 'calendar weeks' for a given year & month", function () {
        assert.equals(exports.buildWeeks(2013, 7), [
             {num:31, days:[29, 30, 31,  1,  2,  3,  4]}
            ,{num:32, days:[ 5,  6,  7,  8,  9, 10, 11]} 
            ,{num:33, days:[12, 13, 14, 15, 16, 17, 18]}
            ,{num:34, days:[19, 20, 21, 22, 23, 24, 25]}
            ,{num:35, days:[26, 27, 28, 29, 30, 31,  1]}
            ,{num:36, days:[ 2,  3,  4,  5,  6,  7,  8]}
        ])

        assert.equals(exports.buildWeeks(2013, 1), [
             {num:5, days:[28, 29, 30, 31,  1,  2,  3]}
            ,{num:6, days:[ 4,  5,  6,  7,  8,  9, 10]}
            ,{num:7, days:[11, 12, 13, 14, 15, 16, 17]}
            ,{num:8, days:[18, 19, 20, 21, 22, 23, 24]}
            ,{num:9, days:[25, 26, 27, 28,  1,  2,  3]}
            ,{num:10,days:[ 4,  5,  6,  7,  8,  9, 10]}
        ])
    })

    function tds(x) { return x.toDateString() }
}

