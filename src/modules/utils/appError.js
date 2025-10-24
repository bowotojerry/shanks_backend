// Define a new class named AppError that extends the built-in JavaScript Error class.
class AppError extends Error {
  // The constructor method for creating new AppError instances.
  // It accepts a 'message' (the error description) and a 'statusCode' (the HTTP status code).
  constructor(message, statusCode) {
    // Call the parent class (Error) constructor with the error message.
    // This sets the 'message' property and initializes the stack trace.
    super(message)
    
    // Assign the provided HTTP status code to the instance property 'statusCode'.
    this.statusCode = statusCode;
    
    // Determine the general error status ("fail" or "error").
    // If the statusCode starts with '4' (e.g., 400, 404), it's a client error, so set status to "fail".
    // Otherwise (e.g., 5xx status codes), it's a server/unknown error, so set status to "error".
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    
    // Mark this error as 'operational'. Operational errors are expected errors (e.g., invalid input, resource not found) 
    // that the application can handle gracefully, as opposed to programming errors (bugs).
    this.isOperational = true;
    
    // Capture the stack trace. This ensures that the stack trace starts from where the AppError was created, 
    // excluding the constructor call itself, making the trace cleaner and more useful.
    Error.captureStackTrace(this, this.constructor);
  }
}

// Export the AppError class so it can be imported and used in other files.
module.exports = AppError;