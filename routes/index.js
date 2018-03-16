const db = require("../lib/db")

module.exports = function(app) {
	app.get("/", function(req, res) {
		res.redirect("/project/6f404e57-4407-4849-bec3-689ef714a206")
	})

	app.get("/project/:projectID", function(req, res) {
		const projects = db.getProjects()
		const project = db.getProject(req.params.projectID)
		if (project == null) {
			res.redirect("/404")
		}
		res.render("project.html", {
			projects,
			project,
			currentProjectID: req.params.projectID
		})
	})

	app.post("/project/:projectID/save", function(req, res) {
		// console.log(req.params, req)
		db.editProject(req.params.projectID, {
			projectName: req.body.projectName,
			projectManager: req.body.projectManager,
			managerNum: req.body.managerNum,
			email: req.body.email,
			teamMembers: req.body.teamMembers,
			budget: req.body.budget,
			approver: req.body.approver
		})
		res.send("")
	})

	app.post("/project/new", function(req, res) {
		const projectID = db.createProject("Untitled 1")
		res.redirect(`/project/${projectID}`)
	})

	app.get('/download/templates', function(req, res){
		var file = __dirname + '/../public/res/Templates.zip';
		res.download(file);
	})

	app.get('/download/guides', function(req, res){
		var file = __dirname + '/../public/res/Guides.zip';
		res.download(file);
	})

	app.get('/download/suppliers', function(req, res){
		var file = __dirname + '/../public/res/Supplier\ table.pdf';
		res.download(file);
	})



	// server.js
// where your node app starts

// // init project
// var express = require('express');
// var app = express();
// var randomstring = require("randomstring");
// const util = require('util');
// var moment = require('moment');
// const nodeRequest = require('request');
//
// const client_id = "2824966001992944.0374225578827717"
// const client_secret = "3ef5baff0b02b61666106e29eea06b1797403074c63313f470cb9a3a3e5b2c33"
//
// var states = { };
//
// var users = [];
// //OAuth stuff
// app.get("/authorise", function(request, response) {
//   var state = randomstring.generate();
//   states[state] = moment();
//   var url = util.format('https://uclapi.com/oauth/authorise?client_id=%s&state=%s', client_id, state);
//   response.redirect(url);
// });
//
// app.get("/complete", (request, response) => response.sendFile(__dirname + '/views/project/:projectID.html'));
//
// app.get("/callback", function(request, response) {
//   var timeNow = moment();
//   if (request.query.state in states) {
//     if (moment(states[request.query.state]).add(300, 'seconds') > timeNow) {
//       if (request.query.result == "denied") {
//         var deniedText = util.format('The login operation for state %s was denied', request.query.state);
//         response.send(deniedText);
//       } else {
//         // Successful login
//         var tokenUrl = util.format('https://uclapi.com/oauth/token?client_id=%s&client_secret=%s&code=%s', client_id, client_secret, request.query.code);
//         console.log("Token URL: " + tokenUrl);
//         var token = "";
//         var name = "";
//         nodeRequest(tokenUrl, { json: true }, (err, res, body) => {
//           if (err) { return console.log(err); }
//           token = body.token;
//           console.log("Got token: " + token);
//           var userDataUrl = util.format('https://uclapi.com/oauth/user/data?client_secret=%s&token=%s', client_secret, token);
//           nodeRequest(userDataUrl, {json: true}, (err, res, body) => {
//             if (err) { return console.log(err); }
//             name = body.full_name;
//             var protectionKey = randomstring.generate();
//             var user = {
//               "name": body.full_name,
//               "department": body.department,
//               "token": token,
//               "auth_key": protectionKey
//             }
//             users.push(user);
//             var userId = users.length - 1;
//             var redirectUrl = util.format('/complete?id=%s&key=%s', userId, protectionKey);
//             response.redirect(redirectUrl);
//           });
//         });
//       }
//     } else {
//       response.send("Authorisation took more than 5 minutes, so it has failed");
//     }
//   } else {
//     response.send("state does not exist");
//   }
// });
//
// app.get("/userdata/:id/:key", function(request, response) {
//   if (users[request.params.id]["auth_key"] == request.params.key) {
//     response.send(JSON.stringify(
//     {
//       "ok": true,
//       "name": users[request.params.id]["name"],
//       "department": users[request.params.id]["department"]
//     }));
//   }
//   else {
//     response.send(JSON.stringify(
//     {
//       "ok": false
//     }))
//   }
// });
	app.get("*", function(req, res) {
		res.send("404 - Page not found")
	})
}
