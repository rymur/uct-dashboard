var h = require("lymph-client").html

exports.view = function (data) {
    return h.SECTION(
        h.HEADER(h.I({ class: "icon-picture" }), h.SPAN("Measurements")),
        h.TABLE({ class:"widget" },
            h.THEAD(
                h.TH(h.INPUT({ id: "checkAll", type:"checkbox"})),
                h.TH("Date"),
                h.TH("Sample Name"),
                h.TH("Sample Number"),
                h.TH("Meas. Number")
            ),
            h.TBODY(data.map(exports.itemView))
        )
    )
}

exports.formatDate = function (dateString) {
    return new Date(dateString).toDateString()
}

exports.itemView = function (data) {
    return h.TR(
        h.TD(h.INPUT({ type:"checkbox", class:"selected"})),
        h.TD(exports.formatDate(data.measurementDate)),
        h.TD(data.sampleName),
        h.TD(data.sampleNumber),
        h.TD(data.measurementNumber)
    )
}

