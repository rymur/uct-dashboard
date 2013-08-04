var lymphTest = require("lymph-test")
var assert = lymphTest.assert

var EventView = require("../../main/client/EventView")

module.exports = lymphTest.suite("EventView", function (test) {

    var e = {
         scanner: "40"
        ,start: "2013-05-24T16:00:00.000-0500"
        ,end: "2013-05-24T17:00:00.000-0500"
        ,account: "fe_nf1"
        ,comment: "Jean nf1 col2 bone"
        ,part: "full"
    }

    test("creates a div for a given event", function () {

        var r = EventView.eventNode(e)

        assert.equals(r.id, "2013424")
        assert.equals(r.el.tagName, "DIV")
        assert.equals(r.el.className, "event-40 full")
        assert.equals(r.el.innerHTML, "fe_nf1")
    })

    test("create an appropriate sized div for a given event", function () {

        var r = EventView.eventNode(e)

        assert.equals(r.el.style.top, "322px")
        assert.equals(r.el.style.height, "13px")
    })
})

