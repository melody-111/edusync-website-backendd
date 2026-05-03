const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderNumber: { type: String, unique: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    price: Number,
    currency: { type: String, default: 'INR' },
    quantity: Number,
    variant: String,
    image: String
  }],
  billing: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: { type: String, required: true }
  },
  payment: {
    method: { 
      type: String, 
      enum: ['card', 'upi', 'netbanking', 'razorpay', 'paypal', 'cod'], 
      required: true 
    },
    status: { 
      type: String, 
      enum: ['pending', 'paid', 'failed', 'refunded'], 
      default: 'pending' 
    },
    transactionId: String,
    paidAt: Date
  },
  subtotal: Number,
  tax: Number,
  shipping: { type: Number, default: 0 },
  total: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  status: {
    type: String,
    enum: ['placed', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'placed'
  },
  notes: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

OrderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `ES${Date.now().toString().slice(-6)}${count + 1}`;
  }
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Order', OrderSchema);
