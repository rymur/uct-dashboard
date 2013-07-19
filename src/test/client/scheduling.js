var lymphTest = require("lymph-test")
var assert = lymphTest.assert

var scheduling = require("../../main/client/scheduling")

module.exports = lymphTest.suite("client scheduling", function (test) {

    test("processing a single end-of-day event", function () {

        var event = {
             scanner: "40"
            ,start: "2013-07-20T09:00:00.000-0500"
            ,end: "2013-07-20T23:59:59.999-0500"
            ,account: "sterling_tgfb"
            ,comment: ""
            ,part: "full"
        }

        assert.equals(scheduling.separate([event]), [event])
    })

    test("break a single multi day events into separate events", function () {

        var processedData = [//{{
             { 
                 scanner: "40"
                ,start: "2013-05-15T15:00:00.000-0500"
                ,end: "2013-05-16T06:00:00.000-0500"
                ,account: "fe_nasa"
                ,comment: "VBX"
                ,part: "full"
            }
        ] //}}

        var splitDays = scheduling.separate(processedData)

        assert.equals(splitDays.length, 2)
        assert.equals(splitDays[0].start, "2013-05-15T15:00:00.000-0500")
        assert.equals(splitDays[0].end, "2013-05-15T23:59:59.999-0500")
        assert.equals(splitDays[0].part, "begin")
        assert.equals(splitDays[1].start, "2013-05-16T00:00:00.000-0500")
        assert.equals(splitDays[1].end, "2013-05-16T06:00:00.000-0500")
        assert.equals(splitDays[1].part, "end")
    })

    test("not spliting single day events", function () {

        var processedData = [//{{
            { 
                 scanner: "40"
                ,start: "2013-05-24T16:00:00.000-0500"
                ,end: "2013-05-24T17:00:00.000-0500"
                ,account: "fe_nf1"
                ,comment: "Jean nf1 col2 bone"
                ,part: "full"
            }
            ,{ 
                 scanner: "40"
                ,start: "2013-05-15T17:00:00.000-0500"
                ,end: "2013-05-16T06:00:00.000-0500"
                ,account: "fe_nasa"
                ,comment: "VBX"
                ,part: "full"
            }
            ,{ 
                 scanner: "40"
                ,start: "2013-06-07T16:00:00.000-0500"
                ,end: "2013-06-08T21:00:00.000-0500"
                ,account: "orear_plasmin"
                ,comment: ""
                ,part: "full"
            }
        ] //}}

        var splitDays = scheduling.separate(processedData)

        assert.equals(splitDays.length, 5)
        assert.equals(splitDays[0].part, "full")
    })
})

