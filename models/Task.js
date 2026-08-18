// models/Task.js
// Mongoose schema/model for a Task. Matches the assignment's required
// attributes: title, description, isCompleted, dueDate, createdAt/updatedAt.

const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    // Required field - Mongoose will throw a ValidationError if missing
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },

    // Optional free-text field
    description: {
      type: String,
      trim: true,
    },

    // Defaults to false for every new task
    isCompleted: {
      type: Boolean,
      default: false,
    },

    // Optional due date
    dueDate: {
      type: Date,
    },
  },
  {
    // Automatically adds & manages createdAt / updatedAt fields
    timestamps: true,
  }
);

// mongoose.model also auto-generates the `_id` (ObjectId) used as the
// resource identifier in routes like GET /api/tasks/:id
module.exports = mongoose.model("Task", taskSchema);