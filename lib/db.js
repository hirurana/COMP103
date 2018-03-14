const projects = [
  {
    id: "project-1",
    projectName: "Project 1",
    projectManager: "Bob Smith",
    teamMembers: "John Doe, Sangay",
    managerNum: "+44CALLME",
    email: "bob.smith.17@ucl.ac.uk",
    approver: "Cyrus Horban",
  },
  {
    id: "project-2",
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
  const projectID = `${projectName}${Math.random()}`
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
