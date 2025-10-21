const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'full name is required'],
  },
  email: {
    type: String,
    required: [true, 'email is required'],
    unique: [true, 'email already exists'], //This creates an index to ensure email uniqueness
    lowercase: true,
    validate: [validator.isEmail, ' please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'password is required'],
    minLength: 8,
    select: false, //exclude password from query outputs and allows projection
  },
  confirmPassword: {
  validate: {
    validator: function (el) {
      return el === this.password;
    },
    message: 'Passwords are not the same!',
  },
},
  companyName: {
    type: String,
  },
},
  { timestamps: true });

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

userSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

userSchema.set("toJSON", {
  virtuals: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
