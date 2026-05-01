const mongoose = require('mongoose');

const EnquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  organization: String,
  subject: { type: String, required: true },
  message: { type: String, required: true },
  productInterest: { type: String },
  quantity: Number,
  status: { type: String, enum: ['new', 'read', 'replied', 'closed'], default: 'new' },
  adminNotes: String,
  repliedAt: Date,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Enquiry', EnquirySchema);
