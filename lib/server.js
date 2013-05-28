var express = require("express")
var http = require("http")
var path = require("path")
var fs = require("fs")

module.exports = {

    run: function (baseDir) {

        var app = express()

        app.configure(function () {
            app.use(express.favicon())
            app.use(express.logger("dev"))
            app.use(express.bodyParser())
            app.use(express.methodOverride())
            app.use(express.static(path.join(baseDir, "static")))
        });

        app.configure("development", function () {
            app.use(express.errorHandler())
        });

        app.get("/data.json", function (req, res) {
            res.send([])
        });

        app.post("/items", function (req, res) {
            fs.writeFile("data.json", JSON.stringify(req.body), function (err) {
                res.send(200)
            })
        });

        return http.createServer(app).listen(8080, function () {
            console.log("Server is running: http://0.0.0.0:8080");
        })
    }
}
