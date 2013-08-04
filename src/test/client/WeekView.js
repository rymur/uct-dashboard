var lymphTest = require("lymph-test")
var assert = lymphTest.assert

var WeekView = require("../../main/client/WeekView")

module.exports = lymphTest.suite("WeekView", function (test) {

    test("create a set of divs column for each day of the week", function () {
        var attr = WeekView.staticAttr({class:"foo"})
        var r1 = WeekView.cols(attr, function (x) { return "" })
        assert.equals(r1.length, 7)
        assert.equals(r1[0].tagName, "DIV")
        assert.equals(r1[0].className, "foo")
        assert.equals(r1[0].innerHTML, "")
    })

    test("creates a set of divs for each hour of a day", function () {
        var attr = WeekView.staticAttr({class:"foo"})
        var r1 = WeekView.rows(attr, function (x) { return "" })
        assert.equals(r1.length, 24)
        assert.equals(r1[1].tagName, "DIV")
        assert.equals(r1[1].className, "foo")
        assert.equals(r1[1].innerHTML, "")
    })

    test("create an hour label", function () {
        var r1 = WeekView.hourLabel(1)
        assert.equals(r1.innerHTML, "1am")
        assert.equals(r1.tagName, "SPAN")
    })
})

