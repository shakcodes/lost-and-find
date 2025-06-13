import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import validator from "validator";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false
  },
  bio: {
    type: String,
    default: ''
  },
  avatar: {
    type: String,
    default: ''
  },
  forgotPasswordToken: String,
  forgotPasswordExpiry: Date
}, { timestamps: true });

userSchema.methods.getJwtToken = function() {
  return jwt.sign(
    { id: this._id, email: this.email },
    process.env.JWT_SECRET_KEY,
    { expiresIn: process.env.JWT_EXPIRES || '1d' }
  );
};

export default mongoose.model("User", userSchema);
