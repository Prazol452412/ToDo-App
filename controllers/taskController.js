// controllers/taskController.js
// Business logic for each Task endpoint. Each function follows the same
// shape: try the DB operation, respond with the right status code + JSON,
// and forward any error to the global error handler via next(error).

const mongoose = require("mongoose");
const Task = require("../models/Task");

// CREATE TASK
// POST /api/tasks
const createTask = async (req, res, next) => {
  try {
    // Task.create() runs schema validation for us (title required, maxlength, etc.)
    // TODO(reviewed with Prajwol): if validation fails, Mongoose throws a
    // ValidationError here. It gets passed to next(error) and, as written,
    // errorHandler.js currently returns 500 for it instead of the 400 the
    // assignment asks for. See errorHandler.js for the fix options.
    const task = await Task.create(req.body);

    res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// GET ALL TASKS (with optional ?completed=true/false filter)
// GET /api/tasks
const getTasks = async (req, res, next) => {
  try {
    const filter = {};

    if (req.query.completed !== undefined) {
      // Guard against junk values like ?completed=maybe
      if (req.query.completed !== "true" && req.query.completed !== "false") {
        return res.status(400).json({
          success: false,
          message: "completed must be true or false",
        });
      }
      filter.isCompleted = req.query.completed === "true";
    }
    // Newest tasks first
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

// GET ONE TASK
// GET /api/tasks/:id
const getTask = async (req, res, next) => {
  try {
    // A malformed ObjectId (e.g. "abc") would otherwise throw a CastError
    // inside Task.findById - checking first lets us return a clean 404
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    const task = await Task.findById(req.params.id);

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

// UPDATE TASK (full or partial - both PUT and PATCH route to this)
// PUT/PATCH /api/tasks/:id
const updateTask = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // new: true      -> return the UPDATED document, not the old one
    // runValidators -> re-run schema validation on the update
    // TODO(reviewed with Prajwol): same validation-error status code issue
    // as createTask - see errorHandler.js
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

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

// DELETE TASK
// DELETE /api/tasks/:id
const deleteTask = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // 204 No Content: successful delete, nothing to send back
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
};