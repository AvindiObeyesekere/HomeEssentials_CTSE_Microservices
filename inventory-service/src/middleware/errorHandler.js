// Not Found Handler
exports.notFoundHandler = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Global Error Handler
exports.errorHandler = (err, req, res, next) => {
  if (err.name === 'ValidationError') {
    const firstValidationError = Object.values(err.errors || {})[0];
    return res.status(400).json({
      success: false,
      message: firstValidationError?.message || 'Validation error'
    });
  }

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
    ...(process.env.NODE_ENV === 'development' && { error: err })
  });
};
