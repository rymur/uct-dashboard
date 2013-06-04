lymph.define("main", function (require) {

    var c = require("lymph-client")
    var disks = require("disks")
    var mainEl = $("#main")

    c.ajax.get("/cgi-bin/disks.com", function (data) {
        mainEl.append(disks.buildView(disks.preProcess(data)))
    })
})

