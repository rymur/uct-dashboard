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

    var $body = $("body")

    listM = listModel()

    titleV = titleView()

    titleM = titleModel()
    titleM.content = "default"

    titleP = new TitlePresenter(titleM, titleV)
    titleP.renderTo($body)

    listItemFormV = listItemFormView()
    listItemFormP = new ListItemFormPresenter(listM, listItemFormV)
    listItemFormP.renderTo($body)

    listV = listView()
    listP = new ListPresenter(listM, listV)
    listP.renderTo($body)

})

