var config = require("./config")
var app = require("./app")

app.listen(config.port, () => console.log("Server running on port 8000"))

//OAuth stuff
app.get("/authorise", function(request, response) {
  var state = randomstring.generate();
  states[state] = moment();
  var url = util.format('https://uclapi.com/oauth/authorise?client_id=%s&state=%s', client_id, state);
  response.redirect(url);
});
// TODO: change this to take the first project from db
// app.get("/complete", (request, response) => response.sendFile(__dirname + '/views/project/:projectID.html'));
app.get("/complete", (request, response) => response.sendFile(__dirname + '/views/project/6f404e57-4407-4849-bec3-689ef714a206'));

app.get("/callback", function(request, response) {
  var timeNow = moment();
  if (request.query.state in states) {
    if (moment(states[request.query.state]).add(300, 'seconds') > timeNow) {
      if (request.query.result == "denied") {
        var deniedText = `The login operation for state ${request.query.state} was denied`
        response.send(deniedText);
      } else {
        // Successful login
        var tokenUrl = util.format('https://uclapi.com/oauth/token?client_id=%s&client_secret=%s&code=%s', client_id, client_secret, request.query.code);
        console.log("Token URL: " + tokenUrl);
        var token = "";
        var name = "";
        nodeRequest(tokenUrl, { json: true }, (err, res, body) => {
          if (err) { return console.log(err); }
          token = body.token;
          console.log("Got token: " + token);
          var userDataUrl = util.format('https://uclapi.com/oauth/user/data?client_secret=%s&token=%s', client_secret, token);
          nodeRequest(userDataUrl, {json: true}, (err, res, body) => {
            if (err) { return console.log(err); }
            name = body.full_name;
            var protectionKey = randomstring.generate();
            var user = {
              "name": body.full_name,
              "department": body.department,
              "token": token,
              "auth_key": protectionKey,
							"upi": body.upi
            }
						console.log(body);
            users.push(user);
            var userId = users.length - 1;
            var redirectUrl = util.format('/complete?id=%s&key=%s', userId, protectionKey);
            response.redirect(redirectUrl);
          });
        });
      }
    } else {
      response.send("Authorisation took more than 5 minutes, so it has failed");
    }
  } else {
    response.send("state does not exist");
  }
});

app.get("/userdata/:id/:key", function(request, response) {
  if (users[request.params.id]["auth_key"] == request.params.key) {
    response.send(JSON.stringify(
    {
      "ok": true,
      "name": users[request.params.id]["name"],
      "department": users[request.params.id]["department"]
    }));
  }
  else {
    response.send(JSON.stringify(
    {
      "ok": false
    }))
  }
});
	app.get("*", function(req, res) {
		res.send("404 - Page not found")
	})
