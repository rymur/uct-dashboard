var lymphTest = require("lymph-test")
var assert = lymphTest.assert

var scheduling = require("../../main/server/scheduling")

module.exports = lymphTest.suite("server scheduling", function (test) {

    test("parse faces authentication data", function () {
        
        var auth = scheduling.parseFacesAuth(facesAuthData())

        assert.equals(auth, {
            key: "a0d76bb7139ca18b2187e91e39b5d83f"
        })
    })

    test("requests faces auth data", function () {

        var request = {
            post: function (url, cb) {
                return {
                    form: function () {
                        cb(null, null, "dummy") 
                    }
                }
            }
        }

        scheduling.requestFaceAuth(request, function (err, data) {
            assert.equals(data, "dummy")
        })
    })

    test("requests faces schedule data", function () {

        var request = {
            get: function (obj, cb) {
                cb(null, "dummy")
            }
        }

        scheduling.requestFacesData(request, "pknumber", function (err, data) {
            assert.equals(data, "dummy")
        })
    })
})

function facesAuthData () {
    return [
         "<INPUT TYPE=HIDDEN NAME='user' VALUE='manager'>"
        ,"<INPUT TYPE=HIDDEN NAME='pk' VALUE='a0d76bb7139ca18b2187e91e39b5d83f'>"
        ,"<TABLE BORDER=2 BGCOLOR='#DDDDDD'>"
    ].join("\n")
}

