const userService = require('../services/auth-service');
const catchAsync = require('../utils/catchAsync');

//Handles the POST request for user registration and calls the signup service
exports.signup = catchAsync(async (req, res, next) => {
    // calls the signup service with request body data
  const { token, user } = await userService.signup(req.body);

  //Send the Token and store the JWT token in an HttpOnly cookie to make it inaccessible to client-side scripts (XSS prevention).
  const cookieOptions = {
    // Set the cookie to expire based on the token expiration time
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000 // Convert days to milliseconds
    ),
    httpOnly: true, // Prevents client-side JavaScript access
    secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
  };

  res.cookie('jwt', token, cookieOptions);

  // Send a response, success status and the token and user data back to the client.
  res.status(201).json({
    status: 'success',
    token, // send the token in the response for client side use 
    data: {
      user, // Contains fullName, email, companyName, and the virtual 'id', but NOT the password hash.
    },
  });
});