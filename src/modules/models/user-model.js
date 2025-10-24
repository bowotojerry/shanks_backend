const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'full name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'email is required'],
      unique: [true, 'Email already in use, please use another email'], //This creates an index to ensure email uniqueness
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, ' please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'password is required'],
      minLength: [8, 'password must be at least 8 characters long'],
      select: false, //exclude password from query outputs and allows projection
    },
    confirmPassword: {
      required: [true, 'please provide a password confirmation'],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: 'Passwords are not the same!',
      },
    },
    roles: {
      type: String, //[String],
      enum: ['user', 'admin'],
      default: 'user', //['user'],
    },
    companyName: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// pre-save middleware to hash password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); //This is a check to see if the password has actually been changed.
  this.password = await bcrypt.hash(this.password, 12); //This is where the password hashing occurs.
  this.confirmPassword = undefined; //we dont need to store confirmPassword in the database
  next();
});

// instance method to compare passwords
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

//virtual property to return ID as string,useful on the frontend
userSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

userSchema.set('toJSON', {
  virtuals: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
