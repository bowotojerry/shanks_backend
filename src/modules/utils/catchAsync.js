// This module exports a higher-order function (a function that returns another function).
// This pattern is commonly used in Express.js for "catching" errors in async route handlers.
module.exports = (fn) => {
  // The exported function takes a single argument, 'fn', which is expected to be an Express async route handler function (i.e., async (req, res, next) => { ... }).
  return (req, res, next) => {
    // This is the actual Express middleware function that will be executed when a request hits the route.
    // It takes the standard Express arguments: request (req), response (res), and next (next).
    
    // Execute the original route handler function 'fn' with the request, response, and next objects.
    // Since 'fn' is an async function, it returns a Promise.
    fn(req, res, next)
      // Attach a '.catch(next)' to the Promise returned by 'fn'.
      // If the Promise resolves successfully, nothing happens.
      // If the Promise is rejected (meaning an error occurred inside the async function), 
      // the error is automatically passed to the 'next' function.
      // Passing an argument to 'next()' signals Express to skip to the global error-handling middleware.
      .catch(next)
  }
}