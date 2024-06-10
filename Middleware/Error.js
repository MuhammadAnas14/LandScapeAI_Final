const ErrorResponse = require("../Utils/ErrorResponse");

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  console.log(error.message)

  //mongoose bad Object
  if (err.name === "CastError") {
    const message = `Resource not found of ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  //mongoose duplicate key
  if (err.code === 11000) {
    const message = "Duplicate field value entered";
    error = new ErrorResponse(message, 400);
  }

  //mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.error).map((val) => val.messsage);
    error = new ErrorResponse(message, 400);
  }

  console.log("error",error.message)

  res.status(err.statusCode || 500).json({
    success: false,
    error: error.message || "server error",
  });
};

module.exports = errorHandler;