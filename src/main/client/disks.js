lymph.define("disks", function (require) {
    
    var objects = {
        each: function (obj, fn) {
            for (var i in obj) {
                fn(obj[i])
            }
        }
    }

    return {
        buildView: buildView, buildItemView: buildItemView, preProcess: preProcess
    }

    function buildView (data) {
        return SECTION(
            HEADER(I({ class: "icon-hdd" }), SPAN("Disks Usage")),
            TABLE({ class:"widget" },
                THEAD(
                    TH("Name"), TH("Used"), TH("Free"), TH("Total")
                ),
                TBODY(data.map(buildItemView))
            )
        )
    }

    function buildItemView (data) {
        var maxBytes = data.max / 2
        var freeBytes = data.free / 2
        var percent = percentageUsed(freeBytes, maxBytes)
        return TR(
            TD(data.name),
            TD(buildProgressView(percent)),
            TD({ class:"number"}, bytesToSize(freeBytes)),
            TD({ class:"number"}, bytesToSize(maxBytes))
        )
    }
    function buildProgressView (percentage) {
        return METER({ low: "80", high: "95", max: "100", value: percentage, title: percentage + "% Used" })
    }

    function percentageUsed (free, max) {
        var used = max - free
        return ((used / max ) * 100).toFixed(2)
    }

    function bytesToSize (bytes) {
        var sizes = ['KB', 'MB', 'GB', 'TB']
        if (bytes == 0) return 'n/a'
        var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
        if (i == 0) return bytes + ' ' + sizes[i] 
        return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i]
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
            console.log(vol)
            return null
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

    function preProcess (rawData) {
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

        return groupedArray.sort(function (a, b) {
            return (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0
        })
    }
})

