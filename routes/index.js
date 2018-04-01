// init project
const db = require("../lib/db")
const path = require('path')
var randomstring = require("randomstring");
var moment = require('moment');
const nodeRequest = require('request');
const util = require("util")
const uuid = require('uuid/v4');

const client_id = "2824966001992944.0374225578827717"
const client_secret = "3ef5baff0b02b61666106e29eea06b1797403074c63313f470cb9a3a3e5b2c33"

var states = { };

module.exports = function(app) {
	app.get("/", function(req, res) {
		res.redirect('/authorise');
	});

	app.get("/project/:projectID/:upi/:name", function (req, res) {
		var upi = req.params.upi;
		var name = req.params.name;
		var projectID = req.params.projectID;
		db.loadProjects(upi, function (projects) {
			var project = null;
			projects = projects.sort()
			for (let i = 0; i < projects.length; i++) {
				if (projects[i]._id == projectID) {
					project = projects[i].data;
				}
			}
			if (project != null) {
				res.render("project.html", {
					projects,
					project,
					name,
					upi,
					currentProjectID: projectID
				});
			} else {
				res.redirect("/404");
			}
		});
	})

// TODO: keeps adding name as _id instead of upi?
	app.post("/new/:upi/:name", function(req, res) {
		var upi = req.params.upi;
		console.log("test: " + upi);
		var name = req.params.name;
		var projectID = uuid();
		db.createProject(upi, projectID, function() {
			res.redirect(`/project/${projectID}/${upi}/${name}`);
		});
	});

	app.post("/delete/:projectID/:upi/:name", function(req, res) {
		const projectID = req.params.projectID;
		const upi = req.params.upi;
		const name = req.params.name;
		db.deleteProject(upi, projectID);
		db.loadProjects(upi, function (projects) {
			var projectID = projects[0]._id;
			res.redirect(`/project/${projectID}/${upi}/${name}`)
		});
	});

	app.post("/send/:approverEmail/:projectManager/:url/:pmEmail", function (req, res) {
		db.sendMail(req.params.approverEmail,req.params.projectManager,req.params.url,req.params.pmEmail, function () {
			console.log("sent to approverEmail");
			res.send("")
		})
	})
	// works fine
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

	app.post("/save/:projectID", function (req, res) {
		console.log("---------------------")
		console.log(JSON.parse(Object.keys(req.body)[0]))
		console.log("---------------------")
		db.saveProject(req.params.projectID, JSON.parse(Object.keys(req.body)[0]));
		res.send("");
	})

	// //OAuth stuff works fine
	app.get("/authorise", function(req, res) {
		var state = randomstring.generate();
		states[state] = moment();
		var url = util.format('https://uclapi.com/oauth/authorise?client_id=%s&state=%s', client_id, state);
		res.redirect(url);
	});

	app.get("/callback", function(req, response) {
		var timeNow = moment();
		if (req.query.state in states) {
			if (moment(states[req.query.state]).add(300, 'seconds') > timeNow) {
				if (req.query.result == "denied") {
					var deniedText = `The login operation for state ${req.query.state} was denied`
					response.send(deniedText);
				} else {
					// Successful login
					var tokenUrl = util.format('https://uclapi.com/oauth/token?client_id=%s&client_secret=%s&code=%s', client_id, client_secret, req.query.code);
					console.log("Token URL: " + tokenUrl);
					var token = "";
					nodeRequest(tokenUrl, { json: true }, (err, res, body) => {
						if (err) { return console.log(err); }
						token = body.token;
						// console.log("Got token: " + token);
						var userDataUrl = util.format('https://uclapi.com/oauth/user/data?client_secret=%s&token=%s', client_secret, token);
						nodeRequest(userDataUrl, {json: true}, (err, res, body) => {
							if (err) { return console.log(err); }
							var name = body.full_name;
							var upi = body.upi;
							var protectionKey = randomstring.generate();
							var user = {
								"name": body.full_name,
								"department": body.department,
								"token": token,
								"auth_key": protectionKey,
								"upi": upi
							}
							console.log(body);
							db.loadProjects(body.upi, function (projects) {
								var projectID = projects[0]._id;
								response.redirect(`/project/${projectID}/${upi}/${name}`)
							});
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

	app.get("*", function (req, res) {
			res.send("ERORR 404: Page Not Found");
	});
}
