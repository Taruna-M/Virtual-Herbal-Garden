//custom error class to handle the errors
class AppError extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
      this.isOperational = true;  //if the error is operational or programming-related
      Error.captureStackTrace(this, this.constructor);  //stack trace for debugging
    }
  }
    
  module.exports = AppError;
    