var lymphTest = require("lymph-test")
var assert = lymphTest.assert

var scheduling = require("../../main/client/scheduling")

module.exports = lymphTest.suite("client scheduling", function (test) {

    var rawData = [
         "40 2013-05-24 16:00:00 2013-05-24 17:00:00 fe_nf1 Jean nf1 col2 bone | N/A"
        ,"40 2013-05-15 17:00:00 2013-05-16 06:00:00 fe_nasa VBX | N/A"
        ,"40 2013-06-07 16:00:00 2013-06-08 21:00:00 orear_plasmin  | N/A"
    ].join("\n")

    var processedData = [//{{
        { 
             scanner: "40"
            ,start: new Date("2013-05-24T16:00:00-0500")
            ,end: new Date("2013-05-24T17:00:00-0500")
            ,account: "fe_nf1"
            ,comment: "Jean nf1 col2 bone"
            ,part: "full"
        }
        ,{ 
             scanner: "40"
            ,start: new Date("2013-05-15T17:00:00-0500")
            ,end: new Date("2013-05-16T06:00:00-0500")
            ,account: "fe_nasa"
            ,comment: "VBX"
            ,part: "full"
        }
        ,{ 
             scanner: "40"
            ,start: new Date("2013-06-07T16:00:00-0500")
            ,end: new Date("2013-06-08T21:00:00-0500")
            ,account: "orear_plasmin"
            ,comment: ""
            ,part: "full"
        }
    ] //}}

    test("extract the fields", function () {
        var actual = scheduling.process(rawData)
        assert.equals(actual, processedData)
    })

    test("breaks multi day events into separate events", function () {

        var actual = scheduling.separate(processedData)

        var expected = [
             { 
                 scanner: "40"
                ,start: new Date("2013-05-24T16:00:00-0500")
                ,end: new Date("2013-05-24T17:00:00-0500")
                ,account: "fe_nf1"
                ,comment: "Jean nf1 col2 bone"
                ,part: "full"
            }
            ,{ 
                 scanner: "40"
                ,start: new Date("2013-05-15T17:00:00-0500")
                ,end: new Date("2013-05-15T23:59:59.999-0500")
                ,account: "fe_nasa"
                ,comment: "VBX"
                ,part: "begin"
            }
            ,{ 
                 scanner: "40"
                ,start: new Date("2013-05-16T00:00:00-0500")
                ,end: new Date("2013-05-16T06:00:00-0500")
                ,account: "fe_nasa"
                ,comment: "VBX"
                ,part: "end"
            }
            ,{ 
                 scanner: "40"
                ,start: new Date("2013-06-07T16:00:00-0500")
                ,end: new Date("2013-06-07T23:59:59.999-0500")
                ,account: "orear_plasmin"
                ,comment: ""
                ,part: "begin"
            }
            ,{ 
                 scanner: "40"
                ,start: new Date("2013-06-08T00:00:00-0500")
                ,end: new Date("2013-06-08T21:00:00-0500")
                ,account: "orear_plasmin"
                ,comment: ""
                ,part: "end"
            }
        ]

        assert.equals(actual, expected)
    })
})

