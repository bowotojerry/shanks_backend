// Import a custom utility class named AppError, likely used for creating standardized error objects.
const AppError = require("./../utils/appError")

// A comment indicating that the following functions handle "Operational errors" (errors expected to happen during normal operation, e.g., invalid user input).
// Operational error

// Function to handle MongoDB "CastError" (usually when a cast to an expected type, like an invalid ID format, fails).
const handleCastErrorDB = (err) => {
  // Construct a user-friendly error message showing which field (path) and value caused the issue.
  const message = `Invalid ${err.path}: ${err.value}`
  // Create and return a new AppError instance with the message and an HTTP 404 (Not Found) status code.
  return new AppError(message, 404)
};

// Function to handle MongoDB duplicate key errors (error code 11000).
const handleDuplicateFieldsDB = (err) => {
  // Construct a user-friendly error message, extracting the duplicated value (e.g., a username or email) from the 'name' key in 'keyValue'.
  const message = `Duplicate field value ${err.keyValue["name"]} please use another value`
  // Create and return a new AppError instance with the message and an HTTP 400 (Bad Request) status code.
  return new AppError(message, 400)
};

// Function to handle MongoDB Mongoose "ValidationError" (e.g., when required fields are missing or data doesn't match a schema constraint).
const handleValidationErrorDB = (err) => {
  // Extract all validation error messages from the 'errors' object of the Mongoose error and map them into an array of strings.
  const error = Object.values(err.errors).map(el => el.message)
  // Log the array of individual error messages to the console (useful for debugging).
  console.log(error)
  // Construct a single error message by concatenating the base message with the list of specific errors.
  const message = `Invalid input data. ${error}`
  // Create and return a new AppError instance with the message and an HTTP 400 (Bad Request) status code.
  return new AppError(message, 400)
};

// Function to handle JsonWebTokenError (e.g., a malformed token).
const handleJwtError = () => new AppError("Invalid token please login again", 401)
// Function to handle TokenExpiredError (when the JWT has expired).
const handleJwtExpire = () => new AppError("Your token expired please login again", 401)

// Function to send detailed error information in the development environment.
const devError = (err, res) => {
  // Set the response status code based on the error's 'statusCode' property.
  res.status(err.statusCode).json({
    // Include the error status (e.g., 'fail' or 'error').
    status: err.status,
    // Include the full error object (for comprehensive debugging).
    error: err,
    // Include the user-friendly error message.
    message: err.message,
    // Include the stack trace (for tracing where the error occurred).
    stack: err.stack
  })
};

// Function to send minimal error information in the production environment.
const proError = (err, res) => {
  // Check if the error is explicitly marked as operational (meaning it's a known, expected error, like a bad request).
  if (err.isOperational) {
    // If operational, send a clean response with the status code, status, and message.
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    })
  } else {
    // If the error is not operational (an unknown or third-party bug), log the full error to the console for internal investigation.
    console.error("ERROR", err)
    // Send a generic, non-descriptive error message to the client to avoid leaking internal details.
    res.status(500).json({
      status: "err",
      message: "Something went wrong"
    })
  }
};

// The main global error-handling middleware function (takes four arguments: err, req, res, next).
module.exports = (err, req, res, next) => {
  // Ensure the error object has a statusCode; default to 500 (Internal Server Error) if missing.
  err.statusCode = err.statusCode || 500;
  // Ensure the error object has a status; default to "error" if missing.
  err.status = err.status || "error";

  // Check if the application is running in the "development" environment.
  if (process.env.NODE_ENV === "development") {
    // If in development, call the devError function to send a detailed error response.
    devError(err, res) 
  // Check if the application is running in the "production" environment.
  } else if (process.env.NODE_ENV === "production") {
    // Create a mutable copy of the error to potentially transform it into a standardized AppError.
    let error = { ...err }; // Note: The original code used a variable assignment that was then overwritten, but a common practice is to copy properties.

    // Check for a Mongoose "CastError" and reassign 'error' to the handled version.
    if (err.name === "CastError") error = handleCastErrorDB(err)
    // Check for a MongoDB duplicate key error (code 11000) and reassign 'error' to the handled version.
    if (err.code === 11000) error = handleDuplicateFieldsDB(err)
    // Check for a Mongoose "ValidationError" and reassign 'error' to the handled version.
    if (err.name === "ValidationError") error = handleValidationErrorDB(err)
    // Check for a JWT "JsonWebTokenError" and reassign 'error' to the handled version.
    if (err.name === "JsonWebTokenError") error = handleJwtError()
    // Check for a JWT "TokenExpiredError" and reassign 'error' to the handled version.
    if (err.name === "TokenExpiredError") error = handleJwtExpire()
    
    // Call the proError function to send the appropriate response based on the (potentially transformed) error object.
    proError(error, res)
  }
}