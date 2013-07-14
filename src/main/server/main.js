var server = require("lymph-server")
var h = server.html.helpers

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
        else if (req.url === "/cgi-bin/faces_login.com") {

            var data = {
                account:"VUIIS_IVIS",
                savegrp:"on",
                user:"manager",
                saveusr:"on",
                savepwd:"on",
                passwd:"japon",
                end:"0"
            }

            request.post("http://faces.ccrc.uga.edu/ccrcfaces/login.php", function (e, r, body) {
                res.end(body.match(/NAME='pk' VALUE='([0-9a-z]*)'/)[1])
            }).form(data)
        }
        else {
            send(req, req.url).root("static").pipe(res)
        }

    }
}

//route.get("/cgi-bin/authorize.com", function (req, res) {
    //if (req.cookies.uct_uid && req.cookies.uct_uid === "123") {
        //res.send(200)
    //}
    //else {
        //res.send(403)
    //}
//})

//route.post("/cgi-bin/authenticate.com", function (req, res) {
    //if (req.param("username") === "erick" && req.param("password") === "pass") {
        //res.cookie("uct_uid", "123", { path: "/" })
        //res.send("erick,admin")
    //}
    //else if (req.param("username") === "nicole" && req.param("password") === "pass") {
        //res.cookie("uct_uid", "321", { path: "/" })
        //res.send("nicole,user")
    //}
    //else {
        //res.send(403)
    //}
//})

//route.post("/items", function (req, res) {
    //fs.writeFile("data.json", JSON.stringify(req.body), function (err) {
        //res.send(200)
    //})
//});

