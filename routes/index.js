module.exports = function(app) {
	const projects = {
		"project-1": {
			projectName: "Project 1",
			projectManager: "Bob Smith",
			teamMembers: ["John Doe ", " Sangay "]
		},
		"project-2": {
			projectName: "Project 2",
			projectManager: "Johnny Appleseed",
			teamMembers: [" Jo ", " Hey "]
		}
	}

	app.get("/", function(req, res) {
		res.redirect("/project/project-1")
	})

	app.get("/project/:projectID", function(req, res) {
		res.render("project.html", {
			projects: projects,
			project: projects[req.params.projectID],
			currentProjectID: req.params.projectID
		})
	})

	// app.post("/add-video", function(req, res) {
	// 	const videoName = req.body.videoName
	// 	const tags = req.body.tags.split(" ")
	// 	videos[videoName] = tags
	// 	res.redirect("/")
	// })
}
