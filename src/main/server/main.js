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
        else if (req.url === "/faces/auth") {
            scheduling.requestFaceAuth(request, function (err, authData) {
                res.writeHead(200, {
                    "Content-Type": "application/json"
                })
                res.end(JSON.stringify(scheduling.parseFacesAuth(authData)))
            })
        }
        else if (req.url.indexOf("/faces/data") === 0) {
            var pk = req.url.match(new RegExp("pk=([0-9a-z]*)"))[1]
            getAllData(pk, function (allData) {
                res.writeHead(200, {
                    "Content-Type": "application/json"
                })
                res.end(JSON.stringify(allData))
            })
        }
        else {
            send(req, req.url).root("static").pipe(res)
        }

    }

    function getAllData (pk, cb) {
        scheduling.requestFacesData(request, pk, 16, function (err, resFor50) {
            var dataFor50 = scheduling.parseFacesData(resFor50.body, "50")
            scheduling.requestFacesData(request, pk, 9, function (err, resFor40) {
                var dataFor40 = scheduling.parseFacesData(resFor40.body, "40")
                cb(scheduling.separate(dataFor50.concat(dataFor40)))
            })
        })
    }
}

