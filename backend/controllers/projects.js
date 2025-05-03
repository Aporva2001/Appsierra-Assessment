const Project = require("../models/project");
const User = require("../models/user");

exports.postAddProjects = (req, res, next) => {
    const { name, description } = req.body;
    const userId = req.user.id;

    const project = new Project({
        name: name,
        description: description,
        user: userId
    })
    project.save()
        .then(proj => {
            const projectId = proj._id
            console.log(projectId)

            User.findById(userId)
                .then(user => {
                    if (!user) {
                        throw new Error('User not found')
                    }

                    user.projects.push(projectId)

                    user.save()
                        .then(result => {
                            return res.json({ message: "Project added" })
                        })
                })
        })
        .catch(err => {
            console.log(err)
        })

}

exports.getViewProjects = (req, res, next) => {
    console.log(req.user);

}