class CustomError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
  }
}

const ErrorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internel Serve Error";
  res.status(statusCode).json({ success: false, message });
};

export { CustomError, ErrorHandler };
