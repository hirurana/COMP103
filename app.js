var express = require("express")
var session = require("express-session")
var browserify = require("browserify-middleware")

var app = express()

app.disable("x-powered-by")

app.use(express.static(__dirname + "/public"))

var sessionSettings = {
	secret: "A very long secret. A MD5 hash would be great.",
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
