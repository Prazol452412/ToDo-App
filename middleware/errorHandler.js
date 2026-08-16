// Global error handler, must be defined with 4 arguments so Express
// recognizes it as error-handling middleware.
const errorHandler = (err, req, res, next) => {
  console.error(err.stack); // log full error server-side only

  const statusCode = err.statusCode && err.statusCode !== 200 ? err.statusCode : 500;

  res.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? "Internal Server Error" : err.message,
  });
};

module.exports = errorHandler;