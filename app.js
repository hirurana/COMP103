var express = require("express")
var session = require("express-session")
var browserify = require("browserify-middleware")

var app = express()
app.disable("x-powered-by")

app.use(express.static(__dirname + "/public"))

var sessionSettings = {
	secret: "9f8eed6c8608f8ee332f829d902e91f2",
	resave: false,
	saveUninitialized: false,
	cookie: {
		httpOnly: true
	}
}

if (app.get("env") === "production") {
	app.set("trust proxy", 1)
	sessionSettings.cookie.secure = true
}

app.use(session(sessionSettings))

app.use(require("body-parser").urlencoded({
	extended: false
}))

require("./views")(app)
require("./routes")(app)

module.exports = app
