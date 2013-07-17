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

exports.parseFacesData = function (rawData, scannerId) {

    return rawData.split("\n").slice(9).map(dataFromLine).map(extractFields)

    function extractComment (data) {
        return data.slice(data.indexOf(" ", 43)).trim()
    }

    function extractFields (data) {
        var fields = data.split(" ")
        var comment = extractComment(data)
        var start = new Date(fields[0] + " " + fields[1])
        var end = new Date(fields[2] + " " + fields[3]) 
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

exports.separate = function (data) {

    var separatedData = []

    data.forEach(function (e) {
        if (isMultiday(e)) {
            separatedData = separatedData.concat(splitByDays(e))
        }
        else {
            separatedData.push(e)
        } 
    })

    return separatedData

    function splitByDays (e) {
        var days = []
        var d1 = new Date(e.start)
        var d2 = new Date(e.end)
        var firstDay = d1.getDate()
        var lastDay = d2.getDate()

        for (var i = firstDay; i <= lastDay; i++) {

            var event = {
                scanner: e.scanner,
                start: e.start,
                end: e.end,
                account: e.account,
                comment: e.comment,
                part: e.part
            }

            if (i == firstDay) {
                event.end = new Date(new Date(d1.getFullYear(),
                    d1.getMonth(), i, 24, 0, 0, 0) - 1)

                event.part = "begin"
            }
            else if (i == lastDay) {
                event.start = new Date(d1.getFullYear(),
                    d1.getMonth(), i, 0, 0, 0, 0)

                event.part = "end"
            }
            else {
                event.start = new Date(d1.getFullYear(),
                    d1.getMonth(), i, 0, 0, 0, 0)
                event.end = new Date(d1.getFullYear(),
                    d1.getMonth(), i, 24, 0, 0, 0)

                event.part = "middle"
            }

            days.push(event)
        }
        return days 
    }

    function isMultiday (e) {
        var sd = new Date(e.start)
        var ed = new Date(e.end)
        return sd.getDate() !== ed.getDate()
    }
}
