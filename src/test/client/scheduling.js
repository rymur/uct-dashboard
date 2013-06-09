describe("scheduling", function () {

    var assert = chai.assert
    var scheduling = lymph.require("scheduling")

    describe("processing raw data from server", function () {

        var rawData = "40 2013-05-24 16:00:00 2013-05-24 17:00:00 fe_nf1 Jean nf1 col2 bone | N/A\n40 2013-05-15 17:00:00 2013-05-16 06:00:00 fe_nasa VBX | N/A\n40 2013-06-07 16:00:00 2013-06-07 21:00:00 orear_plasmin  | N/A"

        var expectedData = [
            { 
                scanner: "40",
                startDate: "2013-05-24",
                startTime: "16:00:00",
                start: "Fri May 24 2013 16:00:00 GMT-0500 (CDT)",
                endDate: "2013-05-24",
                endTime: "17:00:00",
                end: "Fri May 24 2013 17:00:00 GMT-0500 (CDT)",
                account: "fe_nf1",
                comment: "Jean nf1 col2 bone",
                title: "fe_nf1: Jean nf1 col2 bone",
                allDay: false,
                backgroundColor: "blue"
            },
            { 
                scanner: "40",
                startDate: "2013-05-15",
                startTime: "17:00:00",
                start: "Wed May 15 2013 17:00:00 GMT-0500 (CDT)",
                endDate: "2013-05-16",
                endTime: "06:00:00",
                end: "Thu May 16 2013 06:00:00 GMT-0500 (CDT)",
                account: "fe_nasa",
                comment: "VBX",
                title: "fe_nasa: VBX",
                allDay: false,
                backgroundColor: "blue"
            },
            { 
                scanner: "40",
                startDate: "2013-06-07",
                startTime: "16:00:00",
                start: "Fri Jun 07 2013 16:00:00 GMT-0500 (CDT)",
                endDate: "2013-06-07",
                endTime: "21:00:00",
                end: "Fri Jun 07 2013 21:00:00 GMT-0500 (CDT)",
                account: "fe_nasa",
                comment: "",
                title: "fe_nasa: ",
                allDay: false,
                backgroundColor: "blue"
            }
        ]

        it("extract the fields", function () {
            var result = scheduling.process(rawData)
            assert.deepEqual(result[0], expectedData[0])
        })
    })

    describe.only("a weeks view", function () {

        it("has a label for each hour", function () {
            var view = scheduling.timeSlotLabels()
            var slots = view.querySelectorAll("div")
            assert.equal(slots.length, 49)
            assert.equal(view.childNodes[0].innerHTML, "&nbsp;")
            assert.equal(view.childNodes[1].innerHTML, "1am")
            assert.equal(view.childNodes[2].innerHTML, "&nbsp;")
        })

        it("has a label for the day of week and date", function () {
            var slots = scheduling.daySlotColumns(new Date(2013, 5, 3))
            assert.equal(slots[0].childNodes[0].innerHTML, "Monday 6/3")
        })

        //it("has 7 columns of time slots for each day of week", function () {
            //var slots = scheduling.daySlotColumns(new Date(2013, 5, 3))
            //assert.equal(slots.length, 7)
            //assert.equal(slots[0].querySelectorAll("div").length, 48)
            //assert.equal(slots[1].querySelectorAll("div").length, 48)
        //})

    })
})

