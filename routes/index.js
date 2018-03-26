const db = require("../lib/db")
const path = require('path')
const randomstring = require("randomstring");

// TODO: add to user name and upi
// var upi = "hrana90";

module.exports = function(app) {
	app.get("/", function(req, res) {
		// res.redirect("/project/6f404e57-4407-4849-bec3-689ef714a206")
		res.redirect('/authorise');
	})

	// TODO: get projects from upi
	// app.get("/", function(req, res) {
	// 	db.loadProjects(upi ,function (projects) {
	// 		if (projects != null) {
	// 			console.log(projects);
	// 			// TODO: get a specific project and store json in a variable
	// 			res.redirect("https://www.youtube.com/watch?v=5IWxISz7vYk")
	// 		}
	// 	});



		// const projects = db.getProjects()
		// const project = db.getProject(req.params.projectID)
		// if (project == null) {
		// 	res.redirect("/404")
		// }
		// res.render("project.html", {
		// 	projects,
		// 	project,
		// 	currentProjectID: req.params.projectID
		// })
	// });

	app.post("/project/:projectID/save", function(req, res) {
		db.editProject(req.params.projectID, {
			projectName: req.body.projectName,
			projectManager: req.body.projectManager,
			managerNum: req.body.managerNum,
			email: req.body.email,
			teamMembers: req.body.teamMembers,
			budget: req.body.budget,
			approver: req.body.approver,
			videoURL: req.body.videoURL
		})
		res.send("")
	})

	// TODO: create new project inside MongoDB
	app.post("/project/new", function(req, res) {
		const projectID = db.createProject("Untitled 1")
		res.redirect(`/project/${projectID}`)
	})

	// TODO: create a delete function in db
	app.post("/project/delete", function(req, res) {
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

	app.get('/sendToApprover', function (req, res) {
		// TODO: call save flow
		// TODO: get approver email
		// TODO: call function to send Email
		// TODO: redirect user to complete page
	});

	// server.js
	// where your node app starts

	// init project
	// var randomstring = require("randomstring");
	// // const util = require('util');
	// var moment = require('moment');
	// const nodeRequest = require('request');
	// const util = require("util")
	//
	// const client_id = "2824966001992944.0374225578827717"
	// const client_secret = "3ef5baff0b02b61666106e29eea06b1797403074c63313f470cb9a3a3e5b2c33"
	//
	// var states = { };

	// //OAuth stuff
	app.get("/authorise", function(req, res) {
		var state = randomstring.generate();
		states[state] = moment();
		var url = util.format('https://uclapi.com/oauth/authorise?client_id=%s&state=%s', client_id, state);
		res.redirect(url);
	});

	app.get("/callback", function(req, res) {
		var timeNow = moment();
		if (req.query.state in states) {
			if (moment(states[req.query.state]).add(300, 'seconds') > timeNow) {
				if (req.query.result == "denied") {
					var deniedText = `The login operation for state ${req.query.state} was denied`
					res.send(deniedText);
				} else {
					// Successful login
					var tokenUrl = util.format('https://uclapi.com/oauth/token?client_id=%s&client_secret=%s&code=%s', client_id, client_secret, req.query.code);
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
							// TODO: add db stuff upi can only be accessed here
							// db.checkUser(body.upi)
							// const projects = db.getProjects()
							// const project = db.getProject(req.params.projectID)
							// if (project == null) {
							// 	res.redirect("/404")
							// }
							// res.render("project.html", {
							// 	projects,
							// 	project,
							// 	currentProjectID: req.params.projectID
							// })
							// db.loadProjects(body.upi, function (projects) {
							// 	res.render("project.html", {
							// 		projects,
							//
							// 	});
							// });
							res.redirect("https://www.youtube.com/watch?v=rdeQT7KkqM8");
						});
					});
				}
			} else {
				res.send("Authorisation took more than 5 minutes, so it has failed");
			}
		} else {
			res.send("state does not exist");
		}
	});
}
