require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./src/models/Product');
const Partner = require('./src/models/Partner');
const Review = require('./src/models/Review');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/edusync');
    console.log('✅ MongoDB Connected for Seeding...');
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
    process.exit(1);
  }
};

const products = [
  // --- TABLETS: 12 INCH (15k / $399) ---
  { 
    name: "EduSync Ultra 12", 
    slug: "ultra-12",
    tagline: "High Spec · 12-inch Matrix", 
    pricing: {
      IN: { price: 15000, currency: 'INR', symbol: '₹' },
      GLOBAL: { price: 399, currency: 'USD', symbol: '$' }
    },
    image: "/images/products/tablet_writing_1777665766127.png", 
    color: "#111827", 
    badge: "Premium", 
    type: "screen", 
    resolution: "2.5K 120Hz",
    description: "The gold standard for mobile education. Featuring a 12-inch matrix display and zero-latency stylus support." 
  },

  // --- TABLETS: 15 INCH (25k / $699) ---
  { 
    name: "EduSync Studio 15", 
    slug: "studio-15",
    tagline: "Expansive · 15-inch Canvas", 
    pricing: {
      IN: { price: 25000, currency: 'INR', symbol: '₹' },
      GLOBAL: { price: 699, currency: 'USD', symbol: '$' }
    },
    image: "/images/products/tablet_writing_1777665766127.png", 
    color: "#D44D25", 
    badge: "Professional", 
    type: "screen", 
    resolution: "3K 120Hz",
    description: "Designed for advanced engineering and design. 15 inches of high-fidelity precision." 
  },

  // --- TABLETS: 18 INCH (35k / $999) ---
  { 
    name: "EduSync Grand 18", 
    slug: "grand-18",
    tagline: "Ultimate · 18-inch Display", 
    pricing: {
      IN: { price: 35000, currency: 'INR', symbol: '₹' },
      GLOBAL: { price: 999, currency: 'USD', symbol: '$' }
    },
    image: "/images/products/flagship_tablet_pro_1777741226620.png", 
    color: "#6366F1", 
    badge: "Limited Edition", 
    type: "screen", 
    resolution: "4K 120Hz OLED",
    description: "The ultimate digital canvas. 18 inches of immersive learning experience with paper-like texture." 
  },

  // --- SMART PANELS (India 1.9L, Global $4,500) ---
  { 
    name: "EduSync Board 86 Ultra", 
    slug: "board-86-ultra",
    tagline: "8K Canvas · Zero Latency", 
    pricing: {
      IN: { price: 190000, currency: 'INR', symbol: '₹' },
      GLOBAL: { price: 4500, currency: 'USD', symbol: '$' }
    },
    image: "/images/products/smart_panel_86_ultra_1777741249606.png", 
    color: "#D44D25", 
    badge: "Flagship", 
    type: "smart-panel", 
    resolution: "8K 120Hz", 
    description: "The ultimate collaboration tool. 86 inches of high-fidelity precision." 
  },

  // --- SERVERS (India > 2.5L, Global 3x India) ---
  { 
    name: "EduSync Core X Server", 
    slug: "core-x-server",
    tagline: "Campus Wide · High Capacity", 
    pricing: {
      IN: { price: 265000, currency: 'INR', symbol: '₹' },
      GLOBAL: { price: 9500, currency: 'USD', symbol: '$' }
    },
    image: "/images/products/enterprise_server_1777665829035.png", 
    color: "#2563EB", 
    badge: "Enterprise", 
    type: "server", 
    description: "The heart of your digital campus. Core X handles massive data traffic with ease." 
  },

  // --- ACCESSORIES ---
  { 
    name: "EduSync Mechanical Folio", 
    slug: "mechanical-folio",
    tagline: "Tactile Typing · Magnetic", 
    pricing: {
      IN: { price: 5500, currency: 'INR', symbol: '₹' },
      GLOBAL: { price: 69, currency: 'USD', symbol: '$' }
    },
    image: "/images/products/premium_keyboard_1777665782251.png", 
    color: "#2563EB", 
    badge: "Premium", 
    type: "accessory", 
    description: "Turn your tablet into a productivity beast. Tactile keys and magnetic connection." 
  }
];

const seedData = async () => {
  try {
    await Product.deleteMany();
    await Partner.deleteMany();
    await Review.deleteMany();

    await Product.insertMany(products);
    console.log('✅ Tablets (12", 15", 18") and Global Pricing seeded successfully!');
    process.exit();
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
    process.exit(1);
  }
};

connectDB().then(seedData);
