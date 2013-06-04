var assert = chai.assert
var client = lymph.require("lymph-client")

describe("disks", function () {

    var disks = lymph.require("disks")

    describe("given raw device data from server", function () {

        var rawData = [
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
        ]

        it("groups physical devices into the logical names", function () {


            var processed = disks.preProcess(rawData)
            assert.equal(processed.length, 6)
        })

        it("sums the free space by logical name", function () {
            var processed = disks.preProcess(rawData)
            assert.equal(processed[3].free, 2013343488)
        })
    })

    describe("given pre-processed data from server", function () {

        var diskData = [
             {"name": "DISK0", "description": "", "free":40307888,   "max":585858420 }
            ,{"name": "DISK1", "description": "", "free":366112640,  "max":390624992 }
            ,{"name": "DISK2", "description": "", "free":5166179840, "max":1757784604}
            ,{"name": "DISK3", "description": "", "free":2013343488, "max":1931640608}
            ,{"name": "DISK4", "description": "", "free":3530395648, "max":1953481050}
            ,{"name": "DISK5", "description": "", "free":23434429440,"max":1954521450}
        ]

        it("builds a list view for a given set of disks data", function () {
            var view = disks.buildView(diskData)
            var itemsRendered = view.querySelectorAll("tr")
            assert.equal(itemsRendered.length, 6)
        })

        describe("a single disk view", function () {

            var view = disks.buildItemView(diskData[0])
            var html = view.outerHTML

            it("has a logical name", function () {
                assert.include(html, "DISK0")
            })

            it("shows the total capacity", function () {
                assert.include(html, "279.36 GB") 
            })

            it("shows the amount of free space", function () {
                assert.include(html, "19.22 GB") 
            })

            it("shows the precentage being used", function () {
                var m = view.querySelector("meter")
                assert.equal(m.value, "93.12")
            })
        })
    })
})

