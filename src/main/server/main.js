var server = require("lymph-server")
var h = server.html.helpers
var scheduling = require("./scheduling")

module.exports = function (send, request) {
    
    return function (req, res) {

        if (req.url === "/") {
            send(req, "index.html").root("static").pipe(res)
        }
        else if (req.url === "/cgi-bin/disks.com") {
            send(req, "disks.json").root("dat").pipe(res)
        }
        else if (req.url.indexOf("/cgi-bin/faces_data.com") === 0) {
            send(req, "faces_data.txt").root("dat").pipe(res)
        }
        else if (req.url === "/cgi-bin/measurements.com") {
            send(req, "measurements.json").root("misc").pipe(res)
        }
        else if (req.url === "/facesAuth") {
            scheduling.requestFaceAuth(request, function (err, authData) {
                res.writeHead(200, {
                    "Content-Type": "application/json"
                })
                res.end(JSON.stringify(scheduling.parseFacesAuth(authData)))
            })
        }
        else if (req.url.indexOf("/facesData") === 0) {
            var pk = req.url.match(new RegExp("pk=([0-9a-z]*)"))[1]
            scheduling.requestFacesData(request, pk, 16, function (err, r) {
                res.writeHead(200, {
                    "Content-Type": "application/json"
                })
                res.end(JSON.stringify(scheduling.parseFacesData(r.body, "50")))
            })
        }
        else {
            send(req, req.url).root("static").pipe(res)
        }

    }
}

