// server.js
// Entry point of the application: wires up Express, connects to MongoDB,
// mounts routes/middleware, and starts the HTTP server.

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const taskRoutes = require("./routes/taskRoutes");
const errorHandler = require("./middleware/errorHandler");

// Load variables from .env into process.env (MONGODB_URI, PORT, etc.)
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Built-in middleware: parses incoming JSON request bodies into req.body
app.use(express.json());

// Simple health-check route so you can confirm the server is up
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Simple Todo API is running",
  });
});

// All /api/tasks/* requests are handled by taskRoutes
app.use("/api/tasks", taskRoutes);

// Catch-all for any route that doesn't match above (must come AFTER real routes)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global error handler (must be registered last, after all routes)
app.use(errorHandler);

// TODO(reviewed with Prajwol): this connects directly with mongoose.connect()
// using MONGODB_URI, while config/db.js exports a separate connectDB()
// helper that reads MONGO_URI and is never called. Two different env var
// names for the same thing, and one file is dead code. Left as-is until
// you decide: (a) delete config/db.js, or (b) replace the block below with
// `require("./config/db")(); app.listen(...)`.
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });