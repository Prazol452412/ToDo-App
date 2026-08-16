/**
 * Global Error Handling Middleware
 * This middleware catches all errors from controllers and routes
 * and returns a clean JSON response without exposing stack traces to clients
 *
 * Must be registered LAST in server.js (after all routes and middleware)
 * Express recognizes error handlers by their 4-argument signature: (err, req, res, next)
 */
const errorHandler = (err, req, res, next) => {
  // Log the full error details on the server side (for debugging)
  console.error("❌ Error:", err.message);
  if (process.env.NODE_ENV === "development") {
    console.error(err.stack); // Only log stack traces in development
  }

  // Set status code (default to 500 if not specified)
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // Send clean JSON error response to client (no stack trace exposed)
  res.status(statusCode).json({
    success: false,
    message: message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export default errorHandler;
