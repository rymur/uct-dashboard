var lymphTest = require("lymph-test")
var assert = lymphTest.assert

var data = require("../../main/client/data")

module.exports = lymphTest.suite("data utils", function (test) {

    test("retrieve the faces login key in session storage", function () {

        var sampleKey = '{"value":"1", "dateCached":"2013-07-14"}'

        var ss = {
            getItem: function () { return sampleKey }
        }

        var key = data.getKey(ss)
        assert.equals(key, {value: "1", dateCached: "2013-07-14" })
    })

    test("stores the faces login key in session storage", function () {

        var ss = {
            setItem: function (keyName, serializedKey) {
                assert.equals(keyName, "faces-key")
                assert.equals(serializedKey, 
                    '{"value":"1","dateCached":"2013-07-14"}')
            }
        }

        data.setKey(ss, {value: "1", dateCached: "2013-07-14" })
    })

    test("get faces auth from cache", function () {

        var results = null

        data.facesAuth(ajaxGet, getKey, noop)(function (pk) {
            results = pk
        })

        assert.equals(results, "dummy")

        function getKey () {
            return {value:"dummy", dateCached: Date.now()}
        }

        function ajaxGet (y , cb) {}
    })

    test("get faces auth from server", function () {

        var results = null

        data.facesAuth(ajaxGet, getKey, noop)(function (pk) {
            results = pk
        })

        assert.equals(results, "dummy")

        function getKey () { return {value: null, dateCached: null } }
        function ajaxGet (y , cb) { cb("dummy") }
    })

    test("caches faces auth key from server", function () {

        var results = null

        data.facesAuth(ajaxGet, getKey, setKey)(noop)

        assert.equals(results.value, "dummy")

        function getKey () { return {value: null, dateCached: null } }

        function setKey (key) {
            results = key
        }

        function ajaxGet (y , cb) { cb("dummy") }
    })
})

function noop () {}

