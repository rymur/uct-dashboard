var keyName = "faces-key"

exports.getKey = function (ss) {
    var rawKey = ss.getItem(keyName)
    if (rawKey === null) {
        return {
            value: null, dateCached: null
        }
    }
    else {
        return JSON.parse(rawKey)
    }
}

exports.setKey = function (ss, key) {
    ss.setItem(keyName, JSON.stringify(key))
}

exports.facesAuth = function (ajaxGet, getKey, setKey) {

    return function (fn) {

        var key = getKey()

        if (needsRefresh(key)) {
            ajaxGet("/faces/auth", function (pk) {
                setKey({ value: pk, dateCached: Date.now() })
                fn(pk)
            })
        }
        else {
            fn(key.value)
        }
    }

    function needsRefresh (key) {
        if (key.value === null) {
            return true
        } 
        else if (key.dateCached === null) {
            return true
        }
        else {
            return ((Date.now() - key.dateCached) > (1000 * 60 * 5))
        }
    }
}

exports.suite = function (test, assert) {

    test("retrieve the faces login key in session storage", function () {

        var sampleKey = '{"value":"1", "dateCached":"2013-07-14"}'

        var ss = {
            getItem: function () { return sampleKey }
        }

        var key = exports.getKey(ss)
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

        exports.setKey(ss, {value: "1", dateCached: "2013-07-14" })
    })

    test("get faces auth from cache", function () {

        var results = null

        exports.facesAuth(ajaxGet, getKey, noop)(function (pk) {
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

        exports.facesAuth(ajaxGet, getKey, noop)(function (pk) {
            results = pk
        })

        assert.equals(results, "dummy")

        function getKey () { return {value: null, dateCached: null } }
        function ajaxGet (y , cb) { cb("dummy") }
    })

    test("caches faces auth key from server", function () {

        var results = null

        exports.facesAuth(ajaxGet, getKey, setKey)(noop)

        assert.equals(results.value, "dummy")

        function getKey () { return {value: null, dateCached: null } }

        function setKey (key) {
            results = key
        }

        function ajaxGet (y , cb) { cb("dummy") }
    })

    function noop () {}
}

