const jwt = require('jsonwebtoken');
const { catchAsync } = require('../utils/catchAsync');
const AppError = require('./../utils/appError');

const protect = catchAsync(async (req, res, next) => {
  // 1) Get token from header,check if bearer token exists   
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    //split token from Bearer to extract actual token
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  // 2) Verify token
  const decoded = await jwt.verify(token, process.env.JWT_SECRET);

  // 3) Attach user to req
  req.user = decoded; // User ID from token
  next();
});

module.exports = protect;
