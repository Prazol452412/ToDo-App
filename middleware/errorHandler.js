// middleware/errorHandler.js
// Global error handler, must be defined with 4 arguments so Express
// recognizes it as error-handling middleware. Registered LAST in server.js
// so it catches errors forwarded via next(error) from any route/controller.

const errorHandler = (err, req, res, next) => {
  console.error(err.stack); // log full error server-side only, never sent to the client

  // TODO(reviewed with Prajwol): as written this only special-cases errors
  // that already have an explicit err.statusCode set - which none of our
  // Mongoose errors do. That means:
  //   - ValidationError (missing/invalid field, e.g. no title)  -> currently 500, spec wants 400
  //   - CastError (malformed ObjectId reaching Mongoose directly) -> currently 500, spec wants 400/404
  // A minimal fix (not applied yet, confirm before I make this change):
  //
  //   let statusCode = err.statusCode && err.statusCode !== 200 ? err.statusCode : 500;
  //   if (err.name === "ValidationError") statusCode = 400;
  //   if (err.name === "CastError") statusCode = 400;
  //
  const statusCode = err.statusCode && err.statusCode !== 200 ? err.statusCode : 500;

  res.status(statusCode).json({
    success: false,
    // Never leak raw stack traces / internal messages for unexpected 500s
    message: statusCode === 500 ? "Internal Server Error" : err.message,
  });
};

module.exports = errorHandler;