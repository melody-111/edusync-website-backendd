const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  collegeName: { type: String, required: true },
  authorName: { type: String, required: true },
  authorRole: { type: String }, // e.g., "Principal", "IT Head"
  rating: { type: Number, min: 1, max: 5, default: 5 },
  comment: { type: String, required: true },
  avatar: { type: String },
  isApproved: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
