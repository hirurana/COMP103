var config = require("./config")
var app = require("./app")

app.listen(config.port, () => console.log("Server running on port 8000"))
