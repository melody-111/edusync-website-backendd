const mongoose = require('mongoose');

const partnerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  logo: { type: String }, // URL to logo
  location: { type: String },
  studentsCount: { type: Number },
  implementationYear: { type: Number },
  description: { type: String },
  isFeatured: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Partner', partnerSchema);
