const Project = require("../models/project");
const User = require("../models/user");

// Add New Project
exports.postAddProjects = async (req, res, next) => {
  const { name, description } = req.body;
  const userId = req.user.id;

  try {
    const project = new Project({
      name,
      description,
      user: userId
    });

    const savedProject = await project.save();

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.projects.push(savedProject._id);
    await user.save();

    return res.status(201).json({
      message: "Project added successfully",
      project: savedProject
    });

  } catch (err) {
    console.error("Error adding project:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update Existing Project
exports.putUpdateProjects = async (req, res, next) => {
  try {
    const { p_id, name, description, tasks } = req.body;

    if (!p_id) {
      return res.status(400).json({ message: "Project ID (p_id) is required" });
    }

    const updatedProject = await Project.findByIdAndUpdate(
      p_id,
      { name, description, tasks },
      { new: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    return res.status(200).json({
      message: "Project updated successfully",
      project: updatedProject
    });

  } catch (err) {
    console.error("Error updating project:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// View Projects of Logged-In User
exports.getViewProjects = async (req, res, next) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).populate({
      path: "projects",
      populate: {
        path: "tasks",
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const projectsWithStatusCounts = user.projects.map((project) => {
      let completed = 0;
      let notStarted = 0;
      let inProgress = 0;

      project.tasks.forEach((task) => {
        switch (task.status) {
          case "Completed":
            completed++;
            break;
          case "Not started":
            notStarted++;
            break;
          case "In progress":
            inProgress++;
            break;
        }
      });

      return {
        projectId: project._id,
        projectName: project.name,
        description: project.description,
        totalTasks: project.tasks.length,
        completedTasks: completed,
        notStartedTasks: notStarted,
        inProgressTasks: inProgress,
      };
    });
    // console.log(project)
    // console.log(projectsWithStatusCounts)
    return res.status(200).json({ projects: projectsWithStatusCounts });

  } catch (err) {
    console.error("Error fetching projects:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get Project ID by Name
exports.getProjectDetails = async (req, res, next) => {
  const name = req.params.name;

  try {
    const project = await Project.findOne({ name });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    return res.status(200).json({
      message: "Project fetched successfully",
      p_id: project._id
    });

  } catch (err) {
    console.error("Error fetching project by name:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete Project by ID
exports.deleteProject = async (req, res, next) => {
    const projectId = req.params.id;
    const userId = req.user.id;
  
    if (!projectId || projectId === "undefined") {
      return res.status(400).json({ message: "Invalid or missing project ID in URL" });
    }
  
    try {
      const deleted = await Project.findByIdAndDelete(projectId);
      if (!deleted) {
        return res.status(404).json({ message: "Project not found" });
      }
  
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      user.projects = user.projects.filter(
        (projId) => projId.toString() !== projectId
      );
  
      await user.save();
  
      return res.status(200).json({ message: "Project deleted successfully" });
  
    } catch (err) {
      console.error("Error deleting project:", err);
      return res.status(500).json({ message: "Server error", error: err.message });
    }
};
