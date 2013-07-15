var send    = require("send")
var request = require("request")

var main = require("../src/main/server/main")(send, request)

require("lymph-build").server.run(main)

