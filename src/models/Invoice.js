const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: true,
    unique: true
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    subtotal: Number,
    tax: Number,
    total: Number,
    currency: String
  },
  status: {
    type: String,
    enum: ['unpaid', 'paid', 'cancelled', 'refunded'],
    default: 'paid'
  },
  billingDetails: {
    name: String,
    address: String,
    email: String,
    phone: String,
    gstin: String
  },
  issuedAt: {
    type: Date,
    default: Date.now
  },
  pdfUrl: String
}, { timestamps: true });

module.exports = mongoose.model('Invoice', invoiceSchema);
