// routes/taskRoutes.js
// Maps each HTTP method + path to its controller function.
// Mounted in server.js at app.use("/api/tasks", taskRoutes)
// so these paths become: POST /api/tasks, GET /api/tasks/:id, etc.

const express = require("express");

const {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

const router = express.Router();

router.post("/", createTask);       // POST   /api/tasks
router.get("/", getTasks);          // GET    /api/tasks?completed=true
router.get("/:id", getTask);        // GET    /api/tasks/:id
router.put("/:id", updateTask);     // PUT    /api/tasks/:id
router.delete("/:id", deleteTask);  // DELETE /api/tasks/:id

module.exports = router;