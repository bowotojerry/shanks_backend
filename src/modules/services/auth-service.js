const User = require('../models/user-model');
const logger = require('../utils/logger');
const catchAsync = require('../utils/catchAsync');
const appError = require('../utils/appError');
const jwt = require('jsonwebtoken');

//function to sign JWT
const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// user signup service
exports.signup = catchAsync(async (userData) => {
    //Check for existing user
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
        throw new appError('Email already in use, please use another email', 400);
    }
    
    // explicitly filter/allow fields
    const newUserData = {
        fullName: userData.fullName,
        email: userData.email,
        password: userData.password,
        confirmPassword: userData.confirmPassword,
        companyName: userData.companyName, // Optional field
    };
    
    // Create new user in the database
    const newUser = await User.create(newUserData);
    
    // call function that Signs JWT
    const token = signToken(newUser.id); 
    
    // Return token and user object (password is excluded by select: false)
    return { token, user: newUser }; 
});
