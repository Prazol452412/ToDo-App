const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const taskRoutes = require("./routes/taskRoutes");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

dotenv.config();
connectDB();

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "To-Do List API is running" });
});

app.use("/api/tasks", taskRoutes);

// 404 handler — must come after all valid routes
app.use(notFound);

// global error handler — must be the last middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});