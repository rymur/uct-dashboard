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

exports.suite = function (test, assert) {

    var rawData = [ // {{
         {"devName":"SCSERV$DKA0",  "volName":"I64SYS",   "volCount":1, "free":40307888,  "max":585858420, "host":"SCSERV","custer":16}
        ,{"devName":"$3$DGA1",      "volName":"IUSER_01", "volCount":1, "free":366112640, "max":390624992, "host":"SCSERV","custer":64}
        ,{"devName":"$3$DGA100",    "volName":"IDATA_02A","volCount":20,"free":58865664,  "max":1931640608,"host":"SCSERV","custer":256}
        ,{"devName":"$3$DGA101",    "volName":"IDATA_02B","volCount":20,"free":94358528,  "max":1931640608,"host":"SCSERV","custer":256}
        ,{"devName":"$3$DGA102",    "volName":"IDATA_02C","volCount":20,"free":90269184,  "max":1931640608,"host":"SCSERV","custer":256}
        ,{"devName":"$3$DGA103",    "volName":"IDATA_02D","volCount":20,"free":49749760,  "max":1931640608,"host":"SCSERV","custer":256}
        ,{"devName":"$3$DGA104",    "volName":"IDATA_02E","volCount":20,"free":92852736,  "max":1931640608,"host":"SCSERV","custer":256}
        ,{"devName":"$3$DGA105",    "volName":"IDATA_02F","volCount":20,"free":138011904, "max":1931640608,"host":"SCSERV","custer":256}
        ,{"devName":"$3$DGA106",    "volName":"IDATA_02G","volCount":20,"free":91532032,  "max":1931640608,"host":"SCSERV","custer":256}
        ,{"devName":"$3$DGA107",    "volName":"IDATA_02H","volCount":20,"free":143912960, "max":1931640608,"host":"SCSERV","custer":256}
        ,{"devName":"$3$DGA108",    "volName":"IDATA_02I","volCount":20,"free":107606272, "max":1931640608,"host":"SCSERV","custer":256}
        ,{"devName":"$3$DGA109",    "volName":"IDATA_02J","volCount":20,"free":87200256,  "max":1931640608,"host":"SCSERV","custer":256}
        ,{"devName":"$3$DGA110",    "volName":"IDATA_02K","volCount":20,"free":91756800,  "max":1931640608,"host":"SCSERV","custer":256}
        ,{"devName":"$3$DGA111",    "volName":"IDATA_02L","volCount":20,"free":60115200,  "max":1931640608,"host":"SCSERV","custer":256}
        ,{"devName":"$3$DGA112",    "volName":"IDATA_02M","volCount":20,"free":90920704,  "max":1931640608,"host":"SCSERV","custer":256}
        ,{"devName":"$3$DGA113",    "volName":"IDATA_02N","volCount":20,"free":87145728,  "max":1931640608,"host":"SCSERV","custer":256}
        ,{"devName":"$3$DGA114",    "volName":"IDATA_02O","volCount":20,"free":267868672, "max":1931640608,"host":"SCSERV","custer":256}
        ,{"devName":"$3$DGA115",    "volName":"IDATA_02P","volCount":20,"free":84092160,  "max":1931640608,"host":"SCSERV","custer":256}
        ,{"devName":"$3$DGA116",    "volName":"IDATA_02Q","volCount":20,"free":59576832,  "max":1931640608,"host":"SCSERV","custer":256}
        ,{"devName":"$3$DGA117",    "volName":"IDATA_02R","volCount":20,"free":82861568,  "max":1931640608,"host":"SCSERV","custer":256}
        ,{"devName":"$3$DGA118",    "volName":"IDATA_02S","volCount":20,"free":148322816, "max":1931640608,"host":"SCSERV","custer":256}
        ,{"devName":"$3$DGA119",    "volName":"IDATA_02T","volCount":20,"free":86323712,  "max":1931640608,"host":"SCSERV","custer":256}
        ,{"devName":"SCEVAL$DKA100","volName":"",         "volCount":0, "free":0,         "max":0,         "host":"SCEVAL","custer":0}
        ,{"devName":"SCEVAL$DKA200","volName":"",         "volCount":0, "free":0,         "max":0,         "host":"SCEVAL","custer":0}
        ,{"devName":"SCEVAL$DKB0",  "volName":"IDATA_03A","volCount":5, "free":728367872, "max":1953481050,"host":"SCEVAL","custer":256}
        ,{"devName":"SCEVAL$DKB1",  "volName":"IDATA_03B","volCount":5, "free":715771648, "max":1954521450,"host":"SCEVAL","custer":256}
        ,{"devName":"SCEVAL$DKB2",  "volName":"IDATA_03C","volCount":5, "free":737322496, "max":1954521450,"host":"SCEVAL","custer":256}
        ,{"devName":"SCEVAL$DKB3",  "volName":"IDATA_03D","volCount":5, "free":662352384, "max":1954521450,"host":"SCEVAL","custer":256}
        ,{"devName":"SCEVAL$DKB4",  "volName":"IDATA_03E","volCount":5, "free":686581248, "max":1954521450,"host":"SCEVAL","custer":256}
        ,{"devName":"SCEVAL$DKB5",  "volName":"",         "volCount":0, "free":0,         "max":0,         "host":"SCEVAL","custer":0}
        ,{"devName":"SCEVAL$DKB6",  "volName":"",         "volCount":0, "free":0,         "max":0,         "host":"SCEVAL","custer":0}
        ,{"devName":"SCEVAL$DKB7",  "volName":"",         "volCount":0, "free":0,         "max":0,         "host":"SCEVAL","custer":0}
        ,{"devName":"SCEVAL$DKB8",  "volName":"IDATA_04A","volCount":12,"free":1954515712,"max":1954521450,"host":"SCEVAL","custer":256}
        ,{"devName":"SCEVAL$DKB9",  "volName":"IDATA_04B","volCount":12,"free":1954516480,"max":1954521450,"host":"SCEVAL","custer":256}
        ,{"devName":"SCEVAL$DKB10", "volName":"IDATA_04C","volCount":12,"free":1954516480,"max":1954521450,"host":"SCEVAL","custer":256}
        ,{"devName":"SCEVAL$DKB11", "volName":"IDATA_04D","volCount":12,"free":1954516480,"max":1954521450,"host":"SCEVAL","custer":256}
        ,{"devName":"SCEVAL$DKB12", "volName":"IDATA_04E","volCount":12,"free":1954516480,"max":1954521450,"host":"SCEVAL","custer":256}
        ,{"devName":"SCEVAL$DKB13", "volName":"IDATA_04F","volCount":12,"free":1954516480,"max":1954521450,"host":"SCEVAL","custer":256}
        ,{"devName":"SCEVAL$DKB14", "volName":"IDATA_04G","volCount":12,"free":1954516480,"max":1954521450,"host":"SCEVAL","custer":256}
        ,{"devName":"SCEVAL$DKB15", "volName":"IDATA_04H","volCount":12,"free":1954516480,"max":1954521450,"host":"SCEVAL","custer":256}
        ,{"devName":"SCEVAL$DKB16", "volName":"IDATA_04I","volCount":12,"free":1954516480,"max":1954521450,"host":"SCEVAL","custer":256}
        ,{"devName":"SCEVAL$DKB17", "volName":"IDATA_04J","volCount":12,"free":1954516480,"max":1954521450,"host":"SCEVAL","custer":256}
        ,{"devName":"SCEVAL$DKB18", "volName":"IDATA_04K","volCount":12,"free":1954516480,"max":1954521450,"host":"SCEVAL","custer":256}
        ,{"devName":"SCEVAL$DKB19", "volName":"IDATA_04L","volCount":12,"free":1934748928,"max":1934753850,"host":"SCEVAL","custer":256}
        ,{"devName":"SC6507$DKA100","volName":"",         "volCount":0, "free":0,         "max":0,         "host":"SC6507","custer":0}
        ,{"devName":"SC4283$DKA0",  "volName":"",         "volCount":0, "free":0,         "max":0,         "host":"SC4283","custer":0}
        ,{"devName":"SC4283$DKA100","volName":"",         "volCount":0, "free":0,         "max":0,         "host":"SC4283","custer":0}
        ,{"devName":"SC4283$DKC0",  "volName":"IDATA_01A","volCount":3, "free":1712118528,"max":1757784604,"host":"SC4283","custer":256}
        ,{"devName":"SC4283$DKC1",  "volName":"IDATA_01B","volCount":3, "free":1721036288,"max":1757784604,"host":"SC4283","custer":256}
        ,{"devName":"SC4283$DKC2",  "volName":"IDATA_01C","volCount":3, "free":1733025024,"max":1757755800,"host":"SC4283","custer":256}
        ,{"devName":"SC4283$DQA0",  "volName":"",         "volCount":0, "free":0,         "max":0,         "host":"SC4283","custer":0}
        ,{"devName":"SC4283$DKE100","volName":"",         "volCount":0, "free":0,         "max":0,         "host":"SC4283","custer":0}
        ,{"devName":"SCEVA2$DKA0",  "volName":"",         "volCount":0, "free":0,         "max":0,         "host":"SCEVA2","custer":0}
        ,{"devName":"SCEVA3$DKA0",  "volName":"",         "volCount":0, "free":0,         "max":0,         "host":"SCEVA3","custer":0}
        ,{"devName":"SCEVA4$DKA0",  "volName":"",         "volCount":0, "free":0,         "max":0,         "host":"SCEVA4","custer":0}
    ] // }}

    test("groups physical devices into the logical names", function () {
        var processed = exports.preProcess(rawData)
        assert.equals(processed.length, 6)
    })

    test("sums the free space by logical name", function () {
        var processed = exports.preProcess(rawData)
        assert.equals(processed[3].free, 2013343488)
    })
}

