require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const Partner = require('./models/Partner');
const Review = require('./models/Review');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for Seeding...');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const products = [
  {
    name: "EduSync SketchPad", price: 10000,
    image: "https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?auto=format&fit=crop&q=80&w=2000",
    color: "#D44D25", badge: "Most Popular", type: "screen",
    storage: "64 GB", ram: "4 GB", resolution: "2K IPS 120Hz",
    category: "Tablets", featured: true,
    description: "Crystal-clear 2K sketch pad for artists, students, and creators. Pressure-sensitive stylus included.",
  },
  {
    name: "EduSync Pro 4K", price: 15000,
    image: "https://images.unsplash.com/photo-1542222024-c39e2281f121?auto=format&fit=crop&q=80&w=2000",
    color: "#2D6A4F", badge: "Best Value", type: "screen",
    storage: "64 GB", ram: "4 GB", resolution: "4K OLED 144Hz",
    category: "Tablets", featured: true,
    description: "4K OLED display with 144Hz refresh for immersive classroom and creative experiences.",
  },
  {
    name: "EduSync Smart Panel", price: 180000,
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=2000",
    color: "#111111", badge: "Enterprise", type: "smart-panel",
    storage: "256 GB", ram: "16 GB", resolution: "8K UHD",
    category: "Panels", featured: true,
    description: "Massive 75-inch interactive smart panel. Designed for the classrooms of the future.",
  }
];

const partners = [
  { name: "IIT Delhi", logo: "https://upload.wikimedia.org/wikipedia/en/f/fd/IIT_Delhi_logo.svg", studentCount: "12,000+", location: "New Delhi, India" },
  { name: "SRM University", logo: "https://upload.wikimedia.org/wikipedia/en/b/b3/SRM_University_logo.svg", studentCount: "35,000+", location: "Chennai, India" },
  { name: "Manipal Academy", logo: "https://upload.wikimedia.org/wikipedia/en/e/e4/Manipal_Academy_of_Higher_Education_logo.svg", studentCount: "28,000+", location: "Manipal, India" }
];

const reviews = [
  { authorName: "Dr. Arun Kumar", authorRole: "Dean", collegeName: "IIT Delhi", comment: "EduSync has transformed our interactive learning experience. The Nebula sync is flawless.", rating: 5, isApproved: true },
  { authorName: "Sneha Reddy", authorRole: "Design Lead", collegeName: "SRM", comment: "The SketchPad Pro is a game-changer for our creative students. High precision and zero lag.", rating: 5, isApproved: true }
];

const seedData = async () => {
  try {
    await Product.deleteMany();
    await Partner.deleteMany();
    await Review.deleteMany();

    await Product.insertMany(products);
    await Partner.insertMany(partners);
    await Review.insertMany(reviews);

    console.log('✅ Real-time data seeded successfully!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

connectDB().then(seedData);
