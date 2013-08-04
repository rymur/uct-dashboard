exports.parseFacesAuth = function (data) {

    var re = new RegExp("NAME='pk' VALUE='([0-9a-z]*)'")
    var xs = data.match(re)

    return {
        key: xs[1]
    }
}

exports.requestFaceAuth = function (request, done) {

    var creds = {
         account:"VUIIS_IVIS"
        ,savegrp:"on"
        ,user:"manager"
        ,saveusr:"on"
        ,savepwd:"on"
        ,passwd:"japon"
        ,end:"0"
    }

    var url = "http://faces.ccrc.uga.edu/ccrcfaces/login.php"

    request.post(url, function (e, r, body) {
        done(null, body)
    }).form(creds)
}

exports.requestFacesData = function (request, pk, scannerId, done) {
    
    var qsHash = {
         user: "manager"
        ,rndm: 563405192
        ,account: "VUIIS_IVIS"
        ,rindex: scannerId
        ,pk: pk
        ,mode:0
    }

    var url = "http://faces.ccrc.uga.edu/ccrcfaces/data.php"

    request.get({ url: url, qs: qsHash }, function (err, data) {
        done(null, data)
    })
}

exports.parseFacesDataItem = function (scannerId) {

    return function (rawData) {

        return extractFields(dataFromLine(rawData))

        function extractComment (data) {
            return data.slice(data.indexOf(" ", 43)).trim()
        }

        function extractFields (data) {
            var fields = data.split(" ")
            var comment = extractComment(data)
            var start = exports.parseFacesDate(fields[0], fields[1])
            var end = exports.parseFacesDate(fields[2], fields[3]) 
            return {
                scanner: scannerId ? scannerId : "40",
                start: start,
                end: end,
                account:   fields[4],
                comment: comment,
                part: "full"
            }
        }

        function dataFromLine (line) {
            return line.split("|")[0]
        }
    }
}

exports.parseFacesData = function (rawData, scannerId) {

    var rawDataItems = rawData.split("\n")

    return rawDataItems.slice(9, rawDataItems.length - 1)
        .map(exports.parseFacesDataItem(scannerId))
}

exports.parseFacesDate = function (date, time) {
    if (time && time.indexOf(24) === 0) {
        time = "23:59:59.999"
    }
    else {
        time = time + ".000"
    }
    
    return date + "T" + time + "-0500"
}

exports.suite = function (test, assert) {

    test("parse faces authentication data", function () {
        
        var auth = exports.parseFacesAuth(facesAuthData())

        assert.equals(auth, {
            key: "a0d76bb7139ca18b2187e91e39b5d83f"
        })
    })

    test("requests faces auth data", function () {

        var request = {
            post: function (url, cb) {
                return {
                    form: function () {
                        cb(null, null, "dummy") 
                    }
                }
            }
        }

        exports.requestFaceAuth(request, function (err, data) {
            assert.equals(data, "dummy")
        })
    })

    test("requests faces schedule data", function () {

        var request = {
            get: function (obj, cb) {
                cb(null, "dummy")
            }
        }

        exports.requestFacesData(request, "pknumber", 16, function (err, data) {
            assert.equals(data, "dummy")
        })
    })

    test("parses faces scheduling data", function () {

        var rawData = [
             "Schedule data has been updated."
            ,"0 0 1440 -1 -1 -1 -1"
            ,"1 0 1440 -1 -1 -1 -1"
            ,"2 0 1440 -1 -1 -1 -1"
            ,"3 0 1440 -1 -1 -1 -1"
            ,"4 0 1440 -1 -1 -1 -1"
            ,"5 0 1440 -1 -1 -1 -1"
            ,"6 0 1440 -1 -1 -1 -1"
            ,"62"
            ,"2013-05-24 16:00:00 2013-05-24 17:00:00 fe_nf1 Jean nf1 col2 bone | N/A"
            ,"2013-05-15 17:00:00 2013-05-16 06:00:00 fe_nasa VBX | N/A"
            ,"2013-06-07 16:00:00 2013-06-08 21:00:00 orear_plasmin  | N/A"
            ,""
        ].join("\n")

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


        var parsed = exports.parseFacesData(rawData)
        assert.equals(parsed, processedData)
    })

    test("parsing a single end-of-day event", function () {

        var data = "2013-07-20 09:00:00 2013-07-20 24:00:00 sterling_tgfb  | N/A"
        var parsed = exports.parseFacesDataItem("40")(data)

        assert.equals(parsed, { 
             scanner: "40"
            ,start: "2013-07-20T09:00:00.000-0500"
            ,end: "2013-07-20T23:59:59.999-0500"
            ,account: "sterling_tgfb"
            ,comment: ""
            ,part: "full"
        })
    })

    test("converts a normal faces date/time value", function () {

        var date = "2013-05-24"
        var time = "16:00:00"

        var ds = exports.parseFacesDate(date, time)

        assert.equals(ds, "2013-05-24T16:00:00.000-0500")
    })

    test("convert faces date/times with 24:00:00 hour thingy", function () {

        var date = "2013-05-24"
        var time = "24:00:00"

        var ds = exports.parseFacesDate(date, time)

        assert.equals(ds, "2013-05-24T23:59:59.999-0500")
    })

    function facesAuthData () {
        return [
             "<INPUT TYPE=HIDDEN NAME='user' VALUE='manager'>"
            ,"<INPUT TYPE=HIDDEN NAME='pk' VALUE='a0d76bb7139ca18b2187e91e39b5d83f'>"
            ,"<TABLE BORDER=2 BGCOLOR='#DDDDDD'>"
        ].join("\n")
    }
}

