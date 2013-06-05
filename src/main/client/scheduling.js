lymph.define("scheduling", function (require) {
    
    return {
        buildView: buildView, process: process, buildCustomView: buildCustomView
    }

    function buildView (container, data) {
        var cal = $(DIV({ id: "calendar" }))
        container.append(cal)
        cal.fullCalendar({editable:false, defaultView: "agendaWeek", events:data})
    }

    function extractComment (data) {
        return data.slice(data.indexOf(" ", 43)).trim()
    }

    function extractFields (data) {
        var fields = data.split(" ")
        var comment = extractComment(data)
        return {
            scanner: fields[0],
            startDate: fields[1],
            startTime: fields[2],
            start: new Date(fields[1] + " " + fields[2]).toString(),
            endDate:   fields[3],
            endTime:   fields[4],
            end: new Date(fields[3] + " " + fields[4]).toString(),
            account:   fields[5],
            comment: comment,
            title: fields[5] + ": " + comment,
            allDay: false,
            backgroundColor: "blue"
        }
    }

    function dataFromLine (line) {
        return line.split("|")[0]
    }

    function process (rawData) {
        return rawData.split("\n").map(dataFromLine).map(extractFields)
    }


    function buildCustomView (data) {
        return SECTION(
            DIV({ class:"day" }),
            DIV({ class:"day" }),
            DIV({ class:"day" }),
            DIV({ class:"day" }),
            DIV({ class:"day" }),
            DIV({ class:"day" }),
            DIV({ class:"day" })
        )
    }

})

