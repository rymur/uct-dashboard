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
        var firstDay = new Date(e.start).getDate()
        var lastDay = new Date(e.end).getDate()

        for (var i = firstDay; i <= lastDay; i++) {

            if (i == firstDay) {
                days.push(eventWithDates(e,
                    e.start,
                    endOfDayFor(e.start, i),
                    "begin"))
            }
            else if (i == lastDay) {
                days.push(eventWithDates(e,
                    startOfDayFor(e.start, i),
                    e.end,
                    "end"))
            }
            else {
                days.push(eventWithDates(e,
                    startOfDayFor(e.start, i),
                    endOfDayFor(e.start, i), "middle"))
            }
        }
        return days 
    }

    function isMultiday (e) {
        return new Date(e.start).getDate() !== new Date(e.end).getDate()
    }

    function toISODate (y, mo, d, h, m, s, ms) {
        var date = y + "-" + mo + "-" + d
        var time = h + ":" + m  + ":" + s + "." + ms
        return date + "T" + time + "-0500"
    }

    function endOfDayFor(date, da) {
        var yy = padZero(new Date(date).getFullYear())
        var mo = padZero(new Date(date).getMonth() + 1)
        return toISODate(yy, mo, padZero(da), "23", "59", "59", "999")
    }

    function startOfDayFor(date, da) {
        var yy = padZero(new Date(date).getFullYear())
        var mo = padZero(new Date(date).getMonth() + 1)
        return toISODate(yy, mo, padZero(da), "00", "00", "00", "000")
    }

    function eventWithDates (e, start, end, part) {
        return {
             scanner: e.scanner
            ,start: start
            ,end: end
            ,account: e.account
            ,comment: e.comment
            ,part: part
        }
    }

    function padZero (num) {
        return num <= 9 ? "0"+num : num
    }
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

