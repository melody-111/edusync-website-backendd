const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true },
  tagline: { type: String },
  description: { type: String },
  type: { type: String, enum: ['screen', 'accessory', 'bundle', 'smart-panel', 'server'] },
  category: { type: String },
  
  // Regional Pricing Logic
  pricing: {
    IN: { 
      price: { type: Number, required: true }, 
      currency: { type: String, default: 'INR' },
      symbol: { type: String, default: '₹' }
    },
    GLOBAL: { 
      price: { type: Number, required: true }, 
      currency: { type: String, default: 'USD' },
      symbol: { type: String, default: '$' }
    }
  },

  // Legacy price field for backward compatibility
  price: { type: Number },
  
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
  inStock: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
  rating: { type: Number, default: 4.5 },
  reviewCount: { type: Number, default: 0 },
  soldCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

// Auto-generate slug and legacy price from India pricing
ProductSchema.pre('save', function(next) {
  if (!this.slug) {
    this.slug = this.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  }
  if (this.pricing && this.pricing.IN) {
    this.price = this.pricing.IN.price;
  }
  next();
});

module.exports = mongoose.model('Product', ProductSchema);
