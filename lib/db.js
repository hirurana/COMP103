const uuid = require('uuid/v4');

const projects = [
  {
    id: "6f404e57-4407-4849-bec3-689ef714a206",
    projectName: "Project 1",
    projectManager: "Bob Smith",
    teamMembers: "John Doe, Sangay",
    managerNum: "+44CALLME",
    email: "bob.smith.17@ucl.ac.uk",
    approver: "Cyrus Horban",
  },
  {
    id: "12b1ac1f-cf6c-4919-bd25-1cd9dd918b75",
    projectName: "Project 2",
    projectManager: "Johnny Appleseed",
    teamMembers: "Jo, Hey"
  }
]

exports.getProjects = () => {
  return projects
}

exports.getProject = (id) => {
  for (let i = 0; i < projects.length; i++) {
    if (projects[i].id == id) return projects[i]
  }
  return null
}

exports.createProject = (projectName) => {
  // TODO: Replace with UUID
  const projectID = uuid();
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
