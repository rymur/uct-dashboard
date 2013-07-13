//describe("scheduling", function () {

    //var assert = chai.assert
    //var scheduling = lymph.require("scheduling")

    //describe("processing raw data from server", function () {

        //var rawData = [
            //"40 2013-05-24 16:00:00 2013-05-24 17:00:00 fe_nf1 Jean nf1 col2 bone | N/A",
            //"40 2013-05-15 17:00:00 2013-05-16 06:00:00 fe_nasa VBX | N/A",
            //"40 2013-06-07 16:00:00 2013-06-08 21:00:00 orear_plasmin  | N/A"
        //].join("\n")

        //var data1 = [
            //{ 
                //scanner: "40",
                //start: new Date("Fri May 24 2013 16:00:00 GMT-0500 (CDT)"),
                //end: new Date("Fri May 24 2013 17:00:00 GMT-0500 (CDT)"),
                //account: "fe_nf1",
                //comment: "Jean nf1 col2 bone"
            //},
            //{ 
                //scanner: "40",
                //start: new Date("Wed May 15 2013 17:00:00 GMT-0500 (CDT)"),
                //end: new Date("Thu May 16 2013 06:00:00 GMT-0500 (CDT)"),
                //account: "fe_nasa",
                //comment: "VBX"
            //},
            //{ 
                //scanner: "40",
                //start: new Date("Fri Jun 07 2013 16:00:00 GMT-0500 (CDT)"),
                //end: new Date("Fri Jun 07 2013 21:00:00 GMT-0500 (CDT)"),
                //account: "fe_nasa",
                //comment: ""
            //}
        //]

        //it("extract the fields", function () {
            //var result = scheduling.process(rawData)
            //assert.deepEqual(result[0], data1[0])
        //})

        //it("breaks multi day events into separate events", function () {
            //var result = scheduling.separate(data1)

            //var data2 = [
                //{ 
                    //scanner: "40",
                    //start: new Date("Fri May 24 2013 16:00:00 GMT-0500 (CDT)"),
                    //end: new Date("Fri May 24 2013 17:00:00 GMT-0500 (CDT)"),
                    //account: "fe_nf1",
                    //comment: "Jean nf1 col2 bone"
                //},
                //{ 
                    //scanner: "40",
                    //start: new Date("Wed May 15 2013 17:00:00 GMT-0500 (CDT)"),
                    //end: new Date("Wed May 15 2013 23:59:59:999 GMT-0500 (CDT)"),
                    //account: "fe_nasa",
                    //comment: "VBX"
                //},
                //{ 
                    //scanner: "40",
                    //start: new Date("Thu May 16 2013 00:00:00 GMT-0500 (CDT)"),
                    //end: new Date("Thu May 16 2013 06:00:00 GMT-0500 (CDT)"),
                    //account: "fe_nasa",
                    //comment: "VBX"
                //},
                //{ 
                    //scanner: "40",
                    //start: new Date("Fri Jun 07 2013 16:00:00 GMT-0500 (CDT)"),
                    //end: new Date("Fri Jun 07 2013 21:00:00 GMT-0500 (CDT)"),
                    //account: "fe_nasa",
                    //comment: ""
                //}
            //]

            //console.log(result)

            //assert.deepEqual(result, data2)
        //})
    //})

    //describe("a weeks view", function () {

        //it("has a label for each hour", function () {
            //var view = scheduling.timeSlotLabels()
            //var slots = view.querySelectorAll("div")
            //assert.equal(slots.length, 49)
            //assert.equal(view.childNodes[0].innerHTML, "&nbsp;")
            //assert.equal(view.childNodes[1].innerHTML, "12am")
            //assert.equal(view.childNodes[2].innerHTML, "&nbsp;")
        //})

        //it("has a label for the day of week and date", function () {
            //var slots = scheduling.daySlotColumns(new Date(2013, 5, 3))
            //assert.equal(slots[0].childNodes[0].innerHTML, "Monday 6/3")
        //})

        ////it("has 7 columns of time slots for each day of week", function () {
            ////var slots = scheduling.daySlotColumns(new Date(2013, 5, 3))
            ////assert.equal(slots.length, 7)
            ////assert.equal(slots[0].querySelectorAll("div").length, 48)
            ////assert.equal(slots[1].querySelectorAll("div").length, 48)
        ////})

    //})
//})

