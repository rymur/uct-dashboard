var lymphTest = require("lymph-test")

var suite = lymphTest.suite
var assert = lymphTest.assert

module.exports = suite("main", function (test) {
    
    test("sanity", function () {
        assert.equals(true, true)
    })
})

