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

module.exports = restrictTo;
