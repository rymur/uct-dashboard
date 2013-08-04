var send    = require("send")
var request = require("request")

var main = require("../src/server/main")(send, request)

require("lymph-build").server.run(main)

