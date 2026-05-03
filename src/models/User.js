const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, select: false },
  googleId: { type: String },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  
  // Regional settings
  country: { type: String, default: 'India' },
  region: { type: String, enum: ['IN', 'GLOBAL'], default: 'IN' },
  
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
  otpExpiry: Date,
  cart: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, default: 1 },
    variant: String
  }]
}, { timestamps: true });

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  
  // Set region based on country
  if (this.country === 'India' || this.country === 'IN') {
    this.region = 'IN';
  } else {
    this.region = 'GLOBAL';
  }
  
  next();
});

// Compare password
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
