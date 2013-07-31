var lymphTest = require("lymph-test")
var assert = lymphTest.assert

var calendar = require("../../main/client/calendar")

module.exports = lymphTest.suite("calendar", function (test) {

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
        var row = calendar.tableRow(monthModel, 1, monthModel.weeks[0])
        assert.equals(row.className, "active")
        assert.equals(row.childNodes.length, 7)
        assert.equals(row.childNodes[0].tagName, "TD")
        assert.equals(row.childNodes[0].getAttribute("data-week"), "2013:1:1")
    })

    test("create an array of table rows for a given array of week models", function () {

        var weekNum = 1
        var rows = calendar.tableRows(monthModel, weekNum)

        assert.equals(rows.length, 6)
        assert.equals(rows[0].tagName, "TR")
    })

    test("create a calendar title for given year and month", function () {

        var title = calendar.title(2013, 5)

        assert.equals(title.length, 3)
        assert.equals(title[0].id, "cal-prev")
        assert.equals(title[0].getAttribute("data-month"), "2013:5")
        assert.equals(title[1].innerHTML, "June 2013")
        assert.equals(title[2].id, "cal-next")
        assert.equals(title[2].getAttribute("data-month"), "2013:5")
    })
})

