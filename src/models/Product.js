const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String },
  tagline: { type: String },
  description: { type: String },
  type: { type: String, enum: ['screen', 'accessory', 'bundle', 'smart-panel', 'server'] },
  category: { type: String },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  discount: { type: Number, default: 0 },
  image: { type: String },
  images: [String],
  icon: { type: String },
  color: { type: String, default: '#6C63FF' },
  specs: [{
    label: String,
    value: String
  }],
  variants: [{
    name: String,
    price: Number,
    storage: String,
    inStock: { type: Boolean, default: true }
  }],
  accessories: [String],
  badge: { type: String },
  resolution: { type: String },
  storage: { type: String },
  ram: { type: String },
  inStock: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
  rating: { type: Number, default: 4.5 },
  reviewCount: { type: Number, default: 0 },
  soldCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', ProductSchema);
