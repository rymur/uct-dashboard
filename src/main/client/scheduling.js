lymph.define("scheduling", function (require) {
    
    return {
        buildView: buildView, process: process
    }

    function buildView (container, data) {
        var cal = $(DIV({ id: "calendar" }))
        container.append(cal)
        cal.fullCalendar({editable:false, defaultView: "month", events:data})
    }

    function extractComment (data) {
        return data.slice(data.indexOf(" ", 40)).trim()
    }

    function extractFields (data) {
        var fields = data.split(" ")
        var comment = extractComment(data)
        return {
            startDate: fields[0],
            startTime: fields[1],
            start: new Date(fields[0] + " " + fields[1]).toString(),
            endDate:   fields[2],
            endTime:   fields[3],
            end: new Date(fields[2] + " " + fields[3]).toString(),
            account:   fields[4],
            comment: comment,
            title: fields[4] + ": " + comment,
            allDay: false
        }
    }

    function dataFromLine (line) {
        return line.split("|")[0]
    }

    function process (rawData) {
        return rawData.split("\n").map(dataFromLine).map(extractFields)
    }

})

