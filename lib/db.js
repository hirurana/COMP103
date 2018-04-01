const uuid = require('uuid/v4');
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://hirurana:uclengvid123@comp103p-rntjm.mongodb.net/";
const nodemailer = require('nodemailer');

// const projects = [
//   {
//     id: "6f404e57-4407-4849-bec3-689ef714a206",
//     projectName: "Project 1",
//     projectManager: "Bob Smith",
//     teamMembers: "John Doe, Sangay",
//     managerNum: "+447912345678",
//     email: "bob.smith.17@ucl.ac.uk",
//     approver: "Cyrus Horban",
//     check_subtitles: "true",
//     videoURL: "https://www.youtube.com/watch?v=5IWxISz7vYk"
//   },
//   {
//     id: "12b1ac1f-cf6c-4919-bd25-1cd9dd918b75",
//     projectName: "Project 2",
//     projectManager: "Medi-Remi Hashim",
//     teamMembers: "John Doe, Yacoub Ahmed",
//     managerNum: "+447912345678",
//     email: "john.doe.17@ucl.ac.uk",
//     approver: "Cyrus Horban",
//   }
// ]
//
// exports.getProjects = () => {
//   return projects
// }
//
// exports.getProject = (id) => {
//   for (let i = 0; i < projects.length; i++) {
//     if (projects[i].id == id) return projects[i]
//   }
//   return null
// }
//
// exports.createProject = (projectName) => {
//   const projectID = uuid()
//   projects.push({
//     id: projectID,
//     projectName
//   })
//   return projectID
// }
//
// exports.editProject = (projectID, data) => {
//   console.log(projectID)
//   for (let i = 0; i < projects.length; i++) {
//     if (projects[i].id == projectID) {
//       projects[i] = data
//       projects[i].id = projectID
//       console.log("Saved.", projects[i])
//     }
//   }
// }

exports.loadProjects = (upi, callback) => {
  let db = null

  MongoClient.connect(url, function(err, client) {
    if (err) throw err;
    db = client.db("comp103");

    var query = { _id: upi};
    db.collection("users").find(query).toArray(function(err, result) {
      if (err) throw err;
      // if we get a result then get then get users projects and store in array
      if (result.length != 0) {
        var projects = result[0].projectIDs;
        // pass in projects array
        getProjectData(projects, function (content) {
          client.close();
          callback(content);
        });
      } else {
        // if upi does not exist then create a document and a blank project for it.
        const projectID = uuid();
        createNewUser(upi, projectID);
      }
    });
  });

  function getProjectData(projects, callback) {
    var content = [];

    // in a loop query db with each uuid in the projects array
    for (var i in projects) {
      db.collection("projects").find({ _id: String(projects[i])}).toArray(function(err, result) {
        if (err) throw err;
        // result[0] because only one item in result each time and getting value
        // of data, which has all the content in a json
        content.push(result[0]);
        // stop when both arrays are equal in size
        if (content.length == projects.length) {
          callback(content);
        }
      });
    }
  }
}
exports.saveProject = (projectID, newData) => {
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("comp103");
    var searchProject = { _id: projectID};
    var newValues = { $set: {data: newData}};

    dbo.collection("projects").updateOne(searchProject, newValues, function(err, res) {
      if (err) throw err;
      console.log("done");
      db.close();
    });
  });
}
exports.deleteProject = (upi, projectID) => {
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("comp103");

    var projectsQuery = { _id: projectID};
    var usersQuery = { _id: upi};
    // delete in projects
    dbo.collection("projects").deleteOne(projectsQuery, function(err, res) {
      if (err) throw err;
    });

    // delete in users
    dbo.collection("users").find(usersQuery).toArray(function(err, res) {
      if (err) throw err;
      var projects = res[0].projectIDs;
      var index = projects.indexOf(projectID);
      if (index > -1) {
        projects.splice(index, 1);
      };
      var updatedObj = { $set:
        {
          _id: upi,
          projectIDs: projects
        }
      };
      dbo.collection("users").updateOne(usersQuery, updatedObj, function(err, res) {
        if (err) throw err;
        db.close();
      });
    });
  });
}

exports.createProject = (upi, projectID, callback) => {
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("comp103");
    var usersQuery = { _id: upi};
    dbo.collection("users").find(usersQuery).toArray(function (err, res) {
      if (err) throw err;
      var projects = res[0].projectIDs;
      projects.push(projectID);
      var updatedUser = { $set:
        {
          _id: upi,
          projectIDs: projects
        }
      };
      dbo.collection("users").updateOne(usersQuery, updatedUser, function(err, res) {
        if (err) throw err;
        console.log("done");


            // add to projects
            var newProject = {
              _id: projectID,
              data: {
                projectName: "Untitled",
                projectManager: "",
                managerNum: "",
                email: "",
                teamMembers: "",
                budget: 0,
                approverEmail: "",
                checkboxData: {},
                videoURL: ""
              }
            };
            dbo.collection("projects").insertOne(newProject, function(err, res) {
              if (err) throw err;
              callback()
            });
      });
    });
  });
}

exports.sendEmail = (approverEmail, projectManager, url, pmEmail, callback) => {
  var transporter = nodemailer.createTransport({
    host: "smtp.sendgrid.net",
    auth: {
      user: 'azure_bb58a1bf2d5e82319b6b2c1267c327a6@azure.com',
      pass: 'uclengvid'
    }
  });

  var mailOptions = {
    from: '"UCL Video Guidelines" <uclengvid@azure.com>',
    to: approverEmail,
    subject: "UCL Video Guidelines: New approval request",
    text: projectManager + " would like you to check his/her project. \n\n URL: " + url + "\n\n You can send your response at: " + PMEmail
  };

  transporter.sendMail(mailOptions, function(err, res) {
    if (err) throw err;
    console.log("Email sent " + res.response);
    callback()
  });
};

function getProjectData(projects) {
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("comp103");
    var content = new Array();

    for (var i in projects){
      dbo.collection("projects").find({ _id: String(projects[i])}).toArray(function(err, result) {
        if (err) throw err;
        content.push(result[0].data);
        if (content.length == projects.length) {
          db.close();
          return content;
        }
      });
    }
  });

}
function createNewUser(upi) {
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("comp103");

    // generate a projectID
    const projectID = uuid();

    // insert into users
    var usersObj = {
      _id: upi,
      projectIDs: [projectID]
    }
    var projectsObj = {
      _id: projectID,
      data: {
        projectName: "Untitled",
        projectManager: "",
        managerNum: "",
        email: "",
        teamMembers: "",
        budget: 0,
        approverEmail: "",
        checkboxData: {},
        videoURL: ""
      }
    }

    dbo.collection("users").insertOne(usersObj, function(err, res) {
      if (err) throw err;
    });

    dbo.collection("projects").insertOne(projectsObj, function(err, res) {
      if (err) throw err;
    });
    db.close();
  });
}
// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   var dbo = db.db("comp103");
//
//
// })
