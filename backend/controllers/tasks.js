const Task = require("../models/task");
const Project = require('../models/project');

// POST /add-task/:id
exports.postAddTask = async (req, res, next) => {
  const { title, description, status, createdAt, completedAt } = req.body;
  const projectId = req.params.id;

  try {
    const task = new Task({
      projectId: projectId,
      title,
      description,
      status,
      createdAt,
      completedAt,
    });

    const savedTask = await task.save();

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    project.tasks.push(savedTask._id);
    await project.save();

    res.status(201).json({
      message: "Task created successfully",
      taskId: savedTask._id,
      projectId: projectId,
      projectName: project.name,
      description: project.description
    });
  } catch (err) {
    console.error("Error adding task:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// GET /view-tasks/:id
exports.getViewTask = async (req, res, next) => {
  const projectId = req.params.id;

  try {
    const project = await Project.findById(projectId).populate('tasks');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    console.log(project.tasks)

    res.status(200).json({
      projectId: project._id,
      projectName: project.name,
      tasks: project.tasks
    });
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.editTaskById = (req, res, next) =>{
    const taskId= req.params.id;
    const {title, description, status, createdAt,completedAt} = req.body;

    Task.findByIdAndUpdate(taskId)
    .then(task =>{
      task.title= title;
      task.description= description;
      task.status= status;
      task.createdAt= createdAt;
      task.completedAt= completedAt;

      return task.save();
    })
    .then(result =>{
      return res.json({message: "Task updated successfully"})
    })
    .catch(err =>{
      console.log(err);
    })
}

exports.deleteTaskById = async (req, res, next) => {
  try {
    const [taskId, projectId] = req.params.id.split('@');

    // Delete the task
    await Task.findByIdAndDelete(taskId);

    // Update the project to remove the task reference
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    project.tasks = project.tasks.filter(t => t.toString() !== taskId);
    await project.save();

    return res.json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error("Error deleting task:", err);
    return res.status(500).json({ message: "Server error while deleting task" });
  }
};
