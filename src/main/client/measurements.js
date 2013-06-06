lymph.define("measurements", function (require) {
    
    var h = require("lymph-client/html")

    return {
        buildView: buildView, buildItemView: buildItemView
    }

    function buildView (data) {
        var view = h.SECTION(
            h.HEADER(h.I({ class: "icon-picture" }), h.SPAN("Measurements")),
            h.TABLE({ class:"widget" },
                h.THEAD(
                    h.TH(h.INPUT({ id: "checkAll", type:"checkbox"})), h.TH("Date"), h.TH("Sample Name"), h.TH("Sample Number"), h.TH("Meas. Number")
                ),
                h.TBODY(data.map(buildItemView))
            )
        )

        $("#checkAll", view).on("click", function () {
            $("input.selected", view).trigger("click")
        })

        return view
    }

    function formatDate (dateString) {
        return new Date(dateString).toDateString()
    }

    function buildItemView (data) {
        return h.TR(
            h.TD(h.INPUT({ type:"checkbox", class:"selected"})),
            h.TD(formatDate(data.measurementDate)),
            h.TD(data.sampleName),
            h.TD(data.sampleNumber),
            h.TD(data.measurementNumber)
        )
    }
})

