var lymphUtils = require("lymph-utils")

var utils = lymphUtils.utils
var arrays = lymphUtils.arrays

exports.create = function () {

    var listeners = []
    var sent = []

    return {
         listeners: listeners
        ,sent: sent
        ,listen: function (type, fn) {
            listeners.push({type:type, fn:fn})
        }
        ,send: function (type, data) {
            sent.push({type:type, data:data})
            arrays.each(
                sendMessage(data), arrays.filter(isType(type), listeners))
        }
    }
}

function sendMessage (data) {
    return function (listener) {
        listener.fn(data)
    }
}

function isType (type) {
    return function (x) {
        return x.type === type
    }
}

exports.suite = function (test, assert) {

    test("listen for a message", function () {
        var bus = exports.create()

        bus.listen("a:message", function (data) {})

        assert.equals(bus.listeners.length, 1)
    })

    test("sending a message", function () {
        var bus = exports.create()

        bus.send("a:message", {})

        assert.equals(bus.sent.length, 1)
    })

    test("calling a listener when sending a message", function () {
        var bus = exports.create()
        var rst = null

        bus.listen("a:message", function (data) { rst = data })
        bus.send("a:message", {})

        assert.equals(rst, {})
    })

    test("sending past messages", function () {
        var bus = exports.create()
        var rst = null

        bus.listen("a:message", function (data) { rst = data })
        bus.send("a:message", {})

        assert.equals(rst, {})
    })
}

