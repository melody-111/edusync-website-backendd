const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  googleId: { type: String },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  country: { type: String, default: 'India' },
  phone: { type: String },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
  },
  resetToken: String,
  resetTokenExpiry: Date,
  isVerified: { type: Boolean, default: false },
  verificationOTP: String,
  otpExpiry: Date
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
