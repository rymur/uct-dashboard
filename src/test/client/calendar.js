var lymphTest = require("lymph-test")
var assert = lymphTest.assert

var calendar = require("../../main/client/calendar")

module.exports = lymphTest.suite("calendar", function (test) {

    test("model a calendar for a given year and month", function () {

        assert.equals(calendar.modelFor(2013, 7), [
             [29, 30, 31,  1,  2,  3,  4]
            ,[ 5,  6,  7,  8,  9, 10, 11]
            ,[12, 13, 14, 15, 16, 17, 18]
            ,[19, 20, 21, 22, 23, 24, 25]
            ,[26, 27, 28, 29, 30, 31,  1]
            ,[ 2,  3,  4,  5,  6,  7,  8]
        ])

        assert.equals(calendar.modelFor(2013, 1), [
             [28, 29, 30, 31,  1,  2,  3]
            ,[ 4,  5,  6,  7,  8,  9, 10]
            ,[11, 12, 13, 14, 15, 16, 17]
            ,[18, 19, 20, 21, 22, 23, 24]
            ,[25, 26, 27, 28,  1,  2,  3]
            ,[ 4,  5,  6,  7,  8,  9, 10]
        ])
    })

    test("get the start date for a given year and month", function () {
        assert.equals(
            calendar.startDate(2013, 7).toDateString(), "Mon Jul 29 2013")

        assert.equals(
            calendar.startDate(2013, 8).toDateString(), "Mon Aug 26 2013")

        assert.equals(
            calendar.startDate(2013, 1).toDateString(), "Mon Jan 28 2013")
    })

    test("convert an array of days to a table row of cells", function () {
        var model = [0,0,0,0,0,0,0]
        assert.equals(calendar.tableRow(model).childNodes.length, 7)
        assert.equals(calendar.tableRow(model).childNodes[0].tagName, "TD")
    })

    test("convert an array of weeks to an table  body of rows", function () {
        var model = [
             [0,0,0,0,0,0,0]
            ,[0,0,0,0,0,0,0]
            ,[0,0,0,0,0,0,0]
            ,[0,0,0,0,0,0,0]
            ,[0,0,0,0,0,0,0]
            ,[0,0,0,0,0,0,0]
        ]
        assert.equals(calendar.tableBody(model).childNodes.length, 6)
        assert.equals(calendar.tableBody(model).childNodes[0].tagName, "TR")
    })
})

