lymph.define("scheduling", function (require) {
    
    return {
        buildView: buildView
    }

    function buildView (container, data) {
        var cal = $(DIV({ id: "calendar" }))
        container.append(cal)
        cal.fullCalendar({editable:false, events:[]})
    }

})

