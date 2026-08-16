const Task = require("../models/Task");
const mongoose = require("mongoose");

// @desc    Create a new task
// @route   POST /api/tasks
const createTask = async (req, res, next) => {
  try {
    const { title, description, isCompleted, dueDate } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    const task = await Task.create({
      title,
      description,
      isCompleted,
      dueDate,
    });

    res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error) {
    // Mongoose validation errors (e.g. maxlength) also land here
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
};

// @desc    Get all tasks (optionally filtered by completed status)
// @route   GET /api/tasks
// @route   GET /api/tasks?completed=true
const getTasks = async (req, res, next) => {
  try {
    const filter = {};

    if (req.query.completed !== undefined) {
      filter.isCompleted = req.query.completed === "true";
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single task by ID
// @route   GET /api/tasks/:id
const getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a task (full or partial)
// @route   PUT /api/tasks/:id
// @route   PATCH /api/tasks/:id
const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    const task = await Task.findByIdAndUpdate(id, req.body, {
      new: true, // return the updated document
      runValidators: true, // enforce schema validation on update
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
};