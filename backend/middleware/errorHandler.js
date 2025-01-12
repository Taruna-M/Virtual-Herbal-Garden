const AppError = require('../utils/AppError');  // Import the custom error class

const errorHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    console.error('Operational error: ', err)
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  //server issue
  console.error(err); 
  res.status(500).json({
    message: "Something went wrong on the server.",
    error: err.message,
  });
};

module.exports = errorHandler;
