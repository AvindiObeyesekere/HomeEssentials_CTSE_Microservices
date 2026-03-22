const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
};

const errorHandler = (err, req, res, next) => {
  if (err?.isAxiosError) {
    console.error('Order Service Upstream Error:', {
      method: (err.config?.method || 'GET').toUpperCase(),
      url: err.config?.url,
      status: err.response?.status,
      code: err.code,
      message: err.response?.data?.message || err.response?.data?.error?.message || err.message
    });
  } else {
    console.error('Order Service Error:', err?.message || err);
  }

  if (err?.isAxiosError) {
    const upstreamStatus = err.response?.status;
    const upstreamMessage =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.response?.data?.error?.message ||
      err.message;

    if (upstreamStatus) {
      return res.status(upstreamStatus).json({
        success: false,
        message: upstreamMessage || 'Upstream service request failed'
      });
    }

    if (err.code === 'ECONNREFUSED' || err.code === 'ETIMEDOUT' || err.code === 'ENOTFOUND') {
      return res.status(503).json({
        success: false,
        message: 'Required upstream service is unavailable. Please try again shortly.'
      });
    }
  }

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack
    })
  });
};

module.exports = {
  notFoundHandler,
  errorHandler
};

