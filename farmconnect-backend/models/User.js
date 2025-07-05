const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['farmer', 'buyer', 'admin'], default: 'farmer' },
  location: { type: String },
  phoneNumber: { type: String },
  profileImage: { type: String },
  googleId: { type: String },
  facebookId: { type: String },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  isEmailVerified: { type: Boolean, default: false },
  emailVerificationToken: { type: String },
  emailVerificationExpires: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema); 