function create (definition) {
    var defaultProto = {
        isCool: function () {
            return "coo"
        }
    }

    return Object.create(defaultProto, definition)
}

function ListItemFormPresenter (model, view) {

    view.setContent("")

    $(view).on("added", function (e, newItem) {
        var lim = listItemModel()
        lim.text = newItem.text
        model.add(lim)
    })

    this.renderTo = function (container) {
        container.append(view.$el)
    }
}

function listItemFormView () {

    var view = {}

    var content = $("<input>")
    var button = $("<button>Add Item</button>")

    view.$el = $('<div></div>') 

    view.$el.append(content)
    view.$el.append(button)

    view.setContent = function (text) {
        content.val(text)
    }

    $("button", view.$el).on("click", function (e) {
        $(view).trigger("added", { text: content.val() })
    })

    return view
}

function listModel () {

    var items = []
    var model = {}

    model.add = function (newItem) {
        items.push(newItem)
        $(model).trigger("change", newItem)
    }

    model.each = function (fn) {
        items.forEach(fn)
    }

    return model
}

function listView () {

    var view = {}

    view.$el = $("<ul></ul>") 

    view.addItem = function (itemView) {
        view.$el.append(itemView.$el)
    }

    return view
}

function ListPresenter (model, view) {

    // add any existing items
    model.each(function (x) {
        view.addItem(x)
    })

    // listen to the model's change events
    $(model).on("change", function (e, lim) {
        var liv = listItemView()
        var lip = new ListItemPresenter(lim, liv)
        view.addItem(liv)
    })

    this.renderTo = function (container) {
        container.append(view.$el)
    }

    
}

function listItemModel () {

    var text = ""
    var model = {}

    Object.defineProperty(model, "text", {
        enumerable: true,
        configurable: true,
        get: function () {
            return text
        },
        set: function (newValue) {
            text = newValue
            $(model).trigger("change", newValue)
        }
    })

    return model
}

function listItemView () {

    var view = {}

    view.$el = $("<li></li>")

    view.setContent = function (content) {
        view.$el.html(content)
    }

    return view
}

function ListItemPresenter (model, view) {

    view.setContent(model.text)

    this.renderTo = function (container) {
        container.append(view.$el)
    }
}

function titleModel (defaults) {
    defaults = defaults || { content: "" }

    var content = defaults.content
    var model = {}

    Object.defineProperty(model, "content", {
        enumerable: true,
        configurable: true,
        get: function () {
            return content
        },
        set: function (newValue) {
            content = newValue
            $(model).trigger("change", newValue)
        }
    })

    return model
}

function titleView () {

    var view = {}

    view.$el = $("<h1></h1>") 

    Object.defineProperty(view, "content", {
        enumerable: true,
        configurable: true,
        get: function () {
            return this.$el.html()
        },
        set: function (newValue) {
            this.$el.html(newValue)
        }
    })

    view.$el.on("click", function () {
        $(view).trigger("clicked")
    })

    return view
}

function TitlePresenter (model, view) {

    view.content = model.content

    $(view).on("clicked", function () {
        console.log("clicked")
    })

    $(model).on("change", function () {
        console.log("modelchanged", view)
        view.content = model.content
    })

    this.renderTo = function (container) {
        container.append(view.$el)
    }
}

$(document).ready(function () {

    routie("/measurements", function(name) {
        $("#output").html('<table class="table"><tbody><tr><td>One</td><td>two</td><td>three</td></tr></tbody></table>')
        $(".nav li.active").toggleClass("active")
        $("#navMeasurements").addClass("active")
    })

    routie("/scheduling", function(name) {
        $(".nav li.active").toggleClass("active")
        $("#navScheduling").addClass("active")
    })

    routie("/admin", function(name) {
        $(".nav li.active").toggleClass("active")
        $("#navScheduling").addClass("active")
    })

    routie("/", function(name) {
        $(".nav li.active").toggleClass("active")
        $("#navHome").addClass("active")
    })

    $("#btnCancel").on("click", function () {
        $("#output").html("you can't see this")
        $("#login").modal("hide")
    })

    $("#btnLogin").on("click", function () {

        var creds = {
            "username": $("#username").val(),
            "password": $("#password").val()
        }

        var req = jQuery.post("/cgi-bin/authenticate.com", creds)
            
        req.done(function (data) {
            var dataItems = data.replace("\r", "").split(",")
            if (dataItems[1] !== "admin") {
                $("#navAdmin").hide()
            }
            $("#output").html("welcome to dashboard: " + dataItems[0])
            $("#login").modal("hide")
        })

        req.fail(function () {
            console.log("failed")
        })
    })

    var req = jQuery.get("/cgi-bin/authorize.com")
        
    req.done(function (result) {
        console.log("success")
    })

    req.fail(function () {
        $("#login").modal("show")
    })

})

    //var $body = $("body")

    //listM = listModel()

    //titleV = titleView()

    //titleM = titleModel()
    //titleM.content = "default"

    //titleP = new TitlePresenter(titleM, titleV)
    //titleP.renderTo($body)

    //listItemFormV = listItemFormView()
    //listItemFormP = new ListItemFormPresenter(listM, listItemFormV)
    //listItemFormP.renderTo($body)

    //listV = listView()
    //listP = new ListPresenter(listM, listV)
    //listP.renderTo($body)

    //var creds = {
        //"account":"VUIIS_IVIS",
        //"savegrp":"on",
        //"user":"manager",
        //"saveusr":"on",
        //"pwd": null,
        //"savepwd":"on",
        //"passwd":"japon",
        //"end":"0"
    //}

    //jQuery.post("http://faces.ccrc.uga.edu/ccrcfaces/login.php", creds, function (data, statusText) {
        //console.log(statusText, data)
    //})
//
    //$("#login").on("click", function () {

        //var creds = {
            //"username": $("#username").val(),
            //"password": $("#password").val()
        //}

        //jQuery.post("/cgi-bin/show_form.com", creds, function (data, statusText) {
            //console.log(data)
        //}, "json")
    //})
