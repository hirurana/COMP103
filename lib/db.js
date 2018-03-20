const uuid = require('uuid/v4');

const projects = {
  "6f404e57-4407-4849-bec3-689ef714a206":{
    projectName: "Project 1",
    projectManager: "Bob Smith",
    teamMembers: "John Doe, Sangay",
    managerNum: "+447912345678",
    email: "bob.smith.17@ucl.ac.uk",
    approver: "Cyrus Horban",
  },
  "12b1ac1f-cf6c-4919-bd25-1cd9dd918b75":{
    projectName: "Project 2",
    projectManager: "Medi-Remi Hashim",
    teamMembers: "John Doe, Yacoub Ahmed",
    managerNum: "+447912345678",
    email: "john.doe.17@ucl.ac.uk",
    approver: "Cyrus Horban",
  }
}

const users = {
  "hrana90": {
    projects: ['6f404e57-4407-4849-bec3-689ef714a206','12b1ac1f-cf6c-4919-bd25-1cd9dd918b75']
  }
}


exports.getProjects = (upi) => {
  const p = []
  Object.keys(projects).forEach((projectID) => {
    p.push(projects[projectID])
  })
  return p
}

exports.getProject = (id) => {
  return projects[id]
}

exports.createProject = (projectName) => {
  const projectID = uuid()
  projects.push({
    id: projectID,
    projectName
  })
  return projectID
}

exports.editProject = (projectID, data) => {
  console.log(projectID)
  for (let i = 0; i < projects.length; i++) {
    if (projects[i].id == projectID) {
      projects[i] = data
      projects[i].id = projectID
      console.log("Saved.", projects[i])
    }
  }
}
