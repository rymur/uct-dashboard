var h = require("lymph-client").html

exports.buildView = function (data) {
    return h.SECTION(
        h.HEADER(h.I({ class: "icon-hdd" }), h.SPAN("Disks Usage")),
        h.TABLE({ class:"widget" },
            h.THEAD(
                h.TH("Name"), h.TH("Used"), h.TH("Free"), h.TH("Total")
            ),
            h.TBODY(data.map(exports.buildItemView))
        )
    )
}

exports.buildItemView = function (data) {
    var maxBytes = data.max / 2
    var freeBytes = data.free / 2
    var percent = percentageUsed(freeBytes, maxBytes)
    return h.TR(
        h.TD(data.name),
        h.TD(buildProgressView(percent)),
        h.TD({ class:"number"}, bytesToSize(freeBytes)),
        h.TD({ class:"number"}, bytesToSize(maxBytes))
    )

    function buildProgressView (percentage) {
        return h.METER({ low: "80", high: "95", max: "100", value: percentage, title: percentage + "% Used" })
    }
}

exports.preProcess = function (rawData) {
    var grouped = {}
    var groupedArray = []

    rawData.filter(hasVolumes).map(transform).forEach(function (i) {
        if (!grouped[i.name]) {
            grouped[i.name] = i 
        }
        else {
            grouped[i.name].free = grouped[i.name].free + i.free
            grouped[i.name].max = grouped[i.name].max + i.max
        }
    })

    for (var i in grouped) {
        groupedArray.push(grouped[i])
    }

    return groupedArray.sort(sortBy("name"))

    function sortBy (name) {
        return function (a, b) {
            return (a[name] < b[name]) ? -1 : (a[name] > b[name]) ? 1 : 0
        }
    }

    function hasVolumes (device) {
        return device.volCount > 0
    }

    function transform (device) {
        return {
            name: volume2name(device.volName),
            description: "",
            free: device.free,
            max: device.max
        }
    }

    function volume2name (vol) {
        if (vol === "I64SYS") {
            return "DISK0"
        }
        else if (vol === "IUSER_01") {
            return "DISK1"
        }
        else if (/IDATA_02[A-T]/.test(vol)) {
            return "DISK3"
        }
        else if (/IDATA_03[A-E]/.test(vol)) {
            return "DISK4"
        }
        else if (/IDATA_04[A-L]/.test(vol)) {
            return "DISK5"
        }
        else if (/IDATA_01[A-c]/.test(vol)) {
            return "DISK2"
        }
        else {
            return null
        }
    }
}

function percentageUsed (free, max) {
    var used = max - free
    return ((used / max ) * 100).toFixed(2)
}

function bytesToSize (bytes) {
    var sizes = ['KB', 'MB', 'GB', 'TB']
    if (bytes === 0) return 'n/a'
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 0)
    if (i === 0) return bytes + ' ' + sizes[i] 
    return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i]
}

