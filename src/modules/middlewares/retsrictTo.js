const { catchAsync } = require("./../utils");
const AppError = require("./../utils/appError");

const restrictTo = (...roles) => {
  return catchAsync(async (req, res, next) => {
    // roles = ['user', 'admin']
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  });
};

// for multiple roles
// const restrictTo = (...allowedRoles) => {
//   return (req, res, next) => { // NOTE: Removed catchAsync as synchronous check is better
//     // Assuming the user object is attached to req.user by a previous middleware (e.g., protect)
//     const userRoles = req.user.roles; // This is the array, e.g., ['user', 'partner']
    
//     // Check if ANY of the user's roles are included in the list of allowedRoles
//     const hasRequiredRole = userRoles.some(role => 
//         allowedRoles.includes(role) // Is the user's role in the allowed list?
//     );

//     if (!hasRequiredRole) {
//       return next(
//         new AppError("You do not have permission to perform this action", 403)
//       );
//     }
    
//     next();
//   };
// };


module.exports = restrictTo;
