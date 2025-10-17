 const { catchAsync } = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const verifyUser = catchAsync(async (req, res, next) => {
  // Check if user is editing their own profile
  if (req.user.id !== req.params.id) {
    return next(
      new AppError("You can only update your own profile!", 403)
    );
  }
  next();
});

module.exports = verifyUser;