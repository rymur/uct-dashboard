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
            app.use(express.cookieParser())
            app.use(express.methodOverride())
            app.use(app.router)
            app.use(express.static(path.join(baseDir, "static")))
        });

        app.configure("development", function () {
            app.use(express.errorHandler())
        })

        app.get("/cgi-bin/authorize.com", function (req, res) {
            if (req.cookies.uct_uid && req.cookies.uct_uid === "123") {
                res.send(200)
            }
            else {
                res.send(403)
            }
        })

        app.post("/cgi-bin/authenticate.com", function (req, res) {
            if (req.param("username") === "erick" && req.param("password") === "pass") {
                res.cookie("uct_uid", "123", { path: "/" })
                res.send("erick,admin")
            }
            else if (req.param("username") === "nicole" && req.param("password") === "pass") {
                res.cookie("uct_uid", "321", { path: "/" })
                res.send("nicole,user")
            }
            else {
                res.send(403)
            }
        })

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
