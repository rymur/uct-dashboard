var lymphTest = require("lymph-test")
var assert = lymphTest.assert

var calendar = require("../../main/client/calendar")

module.exports = lymphTest.suite("calendar", function (test) {

    test("model for a given year and month", function () {

        assert.equals(calendar.modelFor(2013, 7, 31), {
             year: 2013
            ,month: 7
            ,currentWeek: 31
            ,weeks: [
                 {num:31, days:[29, 30, 31,  1,  2,  3,  4]}
                ,{num:32, days:[ 5,  6,  7,  8,  9, 10, 11]} 
                ,{num:33, days:[12, 13, 14, 15, 16, 17, 18]}
                ,{num:34, days:[19, 20, 21, 22, 23, 24, 25]}
                ,{num:35, days:[26, 27, 28, 29, 30, 31,  1]}
                ,{num:36, days:[ 2,  3,  4,  5,  6,  7,  8]}
            ]
        })

        assert.equals(calendar.modelFor(2013, 1, 5), {
             year: 2013
            ,month: 1
            ,currentWeek: 5
            ,weeks: [
                 {num:5, days:[28, 29, 30, 31,  1,  2,  3]}
                ,{num:6, days:[ 4,  5,  6,  7,  8,  9, 10]}
                ,{num:7, days:[11, 12, 13, 14, 15, 16, 17]}
                ,{num:8, days:[18, 19, 20, 21, 22, 23, 24]}
                ,{num:9, days:[25, 26, 27, 28,  1,  2,  3]}
                ,{num:10,days:[ 4,  5,  6,  7,  8,  9, 10]}
            ]
        })
    })

    test("get the start date for a given year and month", function () {
        assert.equals(
            calendar.startDate(2013, 7).toDateString(), "Mon Jul 29 2013")

        assert.equals(
            calendar.startDate(2013, 8).toDateString(), "Mon Aug 26 2013")

        assert.equals(
            calendar.startDate(2013, 1).toDateString(), "Mon Jan 28 2013")
    })

    test("a week model as row of cells", function () {
        var model = {num:1, days:[0,0,0,0,0,0,0]}
        var tblRow = calendar.tableRow(model, 1)
        assert.equals(tblRow.childNodes.length, 7)
        assert.equals(tblRow.childNodes[0].tagName, "TD")
        assert.equals(tblRow.childNodes[0].getAttribute("data-week"), "1")
    })

    test("convert an array of weeks to an table  body of rows", function () {
        var weeks = [
             {num:1, days:[0,0,0,0,0,0,0]}
            ,{num:2, days:[0,0,0,0,0,0,0]}
            ,{num:3, days:[0,0,0,0,0,0,0]}
            ,{num:4, days:[0,0,0,0,0,0,0]}
            ,{num:5, days:[0,0,0,0,0,0,0]}
            ,{num:6, days:[0,0,0,0,0,0,0]}
        ]

        var tblBody = calendar.tableBody(weeks)

        assert.equals(tblBody.length, 6)
        assert.equals(tblBody[0].tagName, "TR")
    })
})

