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
  // --- TABLETS ---
  { name: "EduSync SketchPad Pro", tagline: "Professional · 120Hz Liquid Retina", price: 12500, image: "/images/products/flagship_tablet_pro_1777741226620.png", color: "#D44D25", badge: "Flagship", type: "screen", storage: "128 GB", ram: "8 GB", resolution: "2K 120Hz", description: "Designed for the elite creator. The SketchPad Pro offers a zero-latency drawing experience and the power of a workstation in a slim profile." },
  { name: "EduSync Air Tab", tagline: "Ultra-Light · Day-Long Battery", price: 9500, image: "/images/products/tablet_writing_1777665766127.png", color: "#10B981", badge: "Portable", type: "screen", storage: "64 GB", ram: "4 GB", resolution: "FHD+ 90Hz", description: "The perfect companion for the modern student. Lightweight enough to carry between classes, powerful enough for everything else." },
  { name: "EduSync Mini Pro", tagline: "Compact · Powerful · 8.4 inch", price: 8500, image: "/images/products/flagship_tablet_pro_1777741226620.png", color: "#6366F1", badge: "Compact", type: "screen", storage: "64 GB", ram: "6 GB", resolution: "2K 60Hz", description: "Small enough to hold in one hand, powerful enough to handle complex research data and immersive reading." },
  { name: "EduSync Studio Max", tagline: "Desktop Power · 14 inch", price: 18500, image: "/images/products/tablet_writing_1777665766127.png", color: "#000000", badge: "Ultimate", type: "screen", storage: "256 GB", ram: "12 GB", resolution: "3K 120Hz OLED", description: "A mobile powerhouse. The Studio Max is designed for engineers and designers who refuse to compromise on screen real estate." },
  { name: "EduSync Note 10", tagline: "Classic · Reliable · Durable", price: 7500, image: "/images/products/flagship_tablet_pro_1777741226620.png", color: "#3B82F6", badge: "Classic", type: "screen", storage: "32 GB", ram: "4 GB", resolution: "FHD 60Hz", description: "The standard for modern classrooms. Robust, affordable, and built to withstand the rigors of daily academic use." },
  { name: "EduSync Slate 11", tagline: "Modern Design · Sharp Display", price: 9000, image: "/images/products/tablet_writing_1777665766127.png", color: "#8B5CF6", badge: "New Arrival", type: "screen", storage: "64 GB", ram: "4 GB", resolution: "2K 60Hz", description: "A sleek, modern slate designed for the next generation of digital-first learning environments." },
  { name: "EduSync Go 10", tagline: "Mobility · Connectivity · Simple", price: 6500, image: "/images/products/flagship_tablet_pro_1777741226620.png", color: "#F59E0B", badge: "Best Value", type: "screen", storage: "32 GB", ram: "3 GB", resolution: "HD+ 60Hz", description: "Everything you need, nothing you don't. The Go 10 is the entry point into the EduSync hardware ecosystem." },
  { name: "EduSync Ultra 12", tagline: "High Spec · Pro Grade", price: 15500, image: "/images/products/tablet_writing_1777665766127.png", color: "#111827", badge: "Premium", type: "screen", storage: "128 GB", ram: "12 GB", resolution: "2.5K 120Hz", description: "Pushing the boundaries of what a tablet can do. The Ultra 12 is for users who demand the absolute best in mobile technology." },
  { name: "EduSync Lite 10", tagline: "Balanced · Essential", price: 7000, image: "/images/products/flagship_tablet_pro_1777741226620.png", color: "#6B7280", badge: "Value", type: "screen", storage: "32 GB", ram: "4 GB", resolution: "FHD 60Hz", description: "A balanced device for general academic use, offering great performance at an accessible price point." },
  { name: "EduSync Vision Pro", tagline: "AR Ready · Future Tech", price: 19500, image: "/images/products/tablet_writing_1777665766127.png", color: "#EC4899", badge: "Limited", type: "screen", storage: "256 GB", ram: "16 GB", resolution: "4K OLED", description: "Our most advanced tablet ever. Equipped with LiDAR and AR-optimized processing for immersive educational experiences." },

  // --- SMART PANELS ---
  { name: "EduSync Board 86 Ultra", tagline: "8K Canvas · Zero Latency", price: 185000, image: "/images/products/smart_panel_86_ultra_1777741249606.png", color: "#D44D25", badge: "Flagship", type: "smart-panel", resolution: "8K 120Hz", description: "The ultimate collaboration tool. 86 inches of high-fidelity precision, designed for the most demanding university lecture halls." },
  { name: "EduSync Board 65 Pro", tagline: "Collaboration Hub · 65-inch", price: 120000, image: "/images/products/smart_panel_1777665813283.png", color: "#2563EB", badge: "Recommended", type: "smart-panel", resolution: "4K 60Hz", description: "Perfect for seminar rooms and breakout spaces. High-speed multi-touch and seamless cloud integration come as standard." },
  { name: "EduSync Board 75 Elite", tagline: "Enterprise Ready · 75-inch", price: 150000, image: "/images/products/smart_panel_86_ultra_1777741249606.png", color: "#10B981", badge: "Elite", type: "smart-panel", resolution: "4K 120Hz", description: "A robust, 75-inch smart display built for daily enterprise and academic rigors. Features advanced eye-care technology." },
  { name: "EduSync Flex 55", tagline: "Mobile · Versatile · 55-inch", price: 85000, image: "/images/products/smart_panel_1777665813283.png", color: "#6366F1", badge: "Versatile", type: "smart-panel", resolution: "4K 60Hz", description: "Bring the classroom anywhere. The Flex 55 features a high-mobility stand and built-in wireless casting." },
  { name: "EduSync Board 98 Giant", tagline: "Auditorium Grade · 98-inch", price: 450000, image: "/images/products/smart_panel_86_ultra_1777741249606.png", color: "#000000", badge: "Giant", type: "smart-panel", resolution: "8K Pro", description: "Command the room. The 98 Giant is designed for large auditoriums, offering unmatched visibility and impact." },
  { name: "EduSync Touch 50", tagline: "Desk Focus · 50-inch", price: 65000, image: "/images/products/smart_panel_1777665813283.png", color: "#3B82F6", badge: "Desk Grade", type: "smart-panel", resolution: "4K High Precision", description: "A high-precision touch surface designed for small group collaboration and individual workstation setups." },
  { name: "EduSync Board 65 Lite", tagline: "Essential · 65-inch", price: 95000, image: "/images/products/smart_panel_86_ultra_1777741249606.png", color: "#6B7280", badge: "Value", type: "smart-panel", resolution: "4K 60Hz", description: "The essential smart panel. Reliable, clear, and easy to use, making digital collaboration accessible to every classroom." },
  { name: "EduSync Studio 75", tagline: "Color Accurate · 75-inch", price: 180000, image: "/images/products/smart_panel_1777665813283.png", color: "#8B5CF6", badge: "Studio Grade", type: "smart-panel", resolution: "4K Adobe RGB", description: "Designed for design. 100% sRGB color accuracy on a massive 75-inch touch canvas." },
  { name: "EduSync Board 86 Pro", tagline: "Collaboration Plus · 86-inch", price: 210000, image: "/images/products/smart_panel_86_ultra_1777741249606.png", color: "#111827", badge: "Pro Plus", type: "smart-panel", resolution: "4K 120Hz", description: "A step up in performance. Enhanced processing power for complex simulations and high-density content management." },
  { name: "EduSync Vision Wall", tagline: "Modular · Expandable", price: 850000, image: "/images/products/smart_panel_1777665813283.png", color: "#EC4899", badge: "Custom", type: "smart-panel", resolution: "Infinite modular", description: "The future of the lecture hall. A modular display system that can be expanded to cover entire walls." },

  // --- SERVERS ---
  { name: "EduSync Node 1", tagline: "Edge Computing · Silent", price: 45000, image: "/images/products/nebula_blade_server_1777741271143.png", color: "#D44D25", badge: "Bestseller", type: "server", storage: "2 TB SSD", ram: "32 GB", description: "Small size, massive impact. Node 1 is a silent powerhouse designed for edge computing in individual classrooms." },
  { name: "EduSync Core X", tagline: "Campus Wide · High Capacity", price: 120000, image: "/images/products/enterprise_server_1777665829035.png", color: "#2563EB", badge: "Campus Choice", type: "server", storage: "16 TB RAID", ram: "128 GB", description: "The heart of your digital campus. Core X handles massive data traffic and real-time collaboration with ease." },
  { name: "EduSync Nexus 5", tagline: "Hybrid Cloud · Secure", price: 85000, image: "/images/products/nebula_blade_server_1777741271143.png", color: "#10B981", badge: "Secure", type: "server", storage: "8 TB SSD", ram: "64 GB", description: "Bridging the gap between local and cloud. Nexus 5 offers secure, high-speed hybrid data management." },
  { name: "EduSync Blade 10", tagline: "High Density · Modular", price: 250000, image: "/images/products/enterprise_server_1777665829035.png", color: "#6366F1", badge: "Density King", type: "server", storage: "Chassis only", ram: "Up to 512 GB", description: "Maximize your rack space. The Blade 10 offers incredible compute density for specialized university research labs." },
  { name: "EduSync Vault 24", tagline: "Massive Storage · Reliable", price: 180000, image: "/images/products/nebula_blade_server_1777741271143.png", color: "#000000", badge: "Storage", type: "server", storage: "100 TB+", ram: "64 GB ECC", description: "Never run out of space. Vault 24 is a high-availability storage server designed for archival of educational content." },
  { name: "EduSync Micro Hub", tagline: "Compact · Portable", price: 25000, image: "/images/products/enterprise_server_1777665829035.png", color: "#3B82F6", badge: "Portable", type: "server", storage: "1 TB", ram: "16 GB", description: "A mobile server for mobile learning. Perfect for field research and temporary classroom setups." },
  { name: "EduSync Tower 8", tagline: "Workstation Grade · Quiet", price: 95000, image: "/images/products/nebula_blade_server_1777741271143.png", color: "#6B7280", badge: "Workstation", type: "server", storage: "4 TB SSD", ram: "64 GB", description: "The best of both worlds. A server-grade workstation that fits under a desk and runs almost silently." },
  { name: "EduSync Stream Max", tagline: "Media Ready · 4K Encoding", price: 145000, image: "/images/products/enterprise_server_1777665829035.png", color: "#8B5CF6", badge: "Media", type: "server", storage: "2 TB NVMe", ram: "32 GB", description: "The ultimate broadcasting tool. Stream Max is optimized for real-time lecture capture and global streaming." },
  { name: "EduSync Quantum 1", tagline: "AI Optimized · Fast", price: 350000, image: "/images/products/nebula_blade_server_1777741271143.png", color: "#111827", badge: "AI Ready", type: "server", storage: "8 TB SSD", ram: "256 GB", description: "Future-proof your institution. Quantum 1 is built specifically for local AI training and specialized research." },
  { name: "EduSync Sync Center", tagline: "Management · Unified", price: 65000, image: "/images/products/enterprise_server_1777665829035.png", color: "#EC4899", badge: "Unified", type: "server", storage: "1 TB", ram: "16 GB", description: "One server to rule them all. The Sync Center provides a unified interface for managing your entire EduSync ecosystem." },

  // --- ACCESSORIES ---
  { name: "EduSync Pro Stylus", tagline: "Zero Latency · 4096 Levels", price: 3500, image: "/images/products/ecosystem_stylus_1777669337533.png", color: "#D44D25", badge: "Essential", type: "accessory", description: "The tool that redefines digital ink. Experience the natural feel of pen on paper with advanced pressure sensitivity." },
  { name: "EduSync Mechanical Folio", tagline: "Tactile Typing · Magnetic", price: 5500, image: "/images/products/premium_keyboard_1777665782251.png", color: "#2563EB", badge: "Premium", type: "accessory", description: "Turn your tablet into a productivity beast. Tactile keys and a rock-solid magnetic connection for work on the go." },
  { name: "EduSync Precision Mouse", tagline: "Multi-Device · Ergonomic", price: 2500, image: "/images/products/premium_mouse_1777665795929.png", color: "#6366F1", badge: "Comfort", type: "accessory", description: "Ergonomics meets precision. Designed for long hours of research and seamless multi-device switching." },
  { name: "EduSync Smart Dock", tagline: "Single Cable · All Ports", price: 4500, image: "/images/products/ecosystem_stylus_1777669337533.png", color: "#10B981", badge: "Bestseller", type: "accessory", description: "Connect your entire setup with a single cable. Features HDMI, Ethernet, and 4 USB-A ports for ultimate connectivity." },
  { name: "EduSync Travel Sleeve", tagline: "Sleek · Protective", price: 1500, image: "/images/products/tablet_writing_1777665766127.png", color: "#000000", badge: "Protection", type: "accessory", description: "Minimalist protection for your hardware. Water-resistant fabric and impact-absorbing lining." },
  { name: "EduSync Active Buds", tagline: "ANC · Immersive", price: 3500, image: "/images/products/ecosystem_stylus_1777669337533.png", color: "#3B82F6", badge: "Audio", type: "accessory", description: "Focus on your learning. Active Noise Cancellation and 30-hour battery life for the focused student." },
  { name: "EduSync Screen Shield", tagline: "Matte · Paper-like", price: 900, image: "/images/products/flagship_tablet_pro_1777741226620.png", color: "#6B7280", badge: "Essential", type: "accessory", description: "The ultimate screen protector. Anti-glare matte finish that makes the screen feel like high-quality paper." },
  { name: "EduSync Stand Pro", tagline: "Aluminum · Infinite Angles", price: 2500, image: "/images/products/ecosystem_stylus_1777669337533.png", color: "#8B5CF6", badge: "Utility", type: "accessory", description: "Precision engineered stand for your tablet or smart panel. Stable at any angle." },
  { name: "EduSync Power Brick", tagline: "65W GaN · Triple Port", price: 1800, image: "/images/products/ecosystem_stylus_1777669337533.png", color: "#111827", badge: "Power", type: "accessory", description: "Compact power for all your devices. Advanced GaN technology for cooler, faster charging." },
  { name: "EduSync Hub Mini", tagline: "Pocket Size · 4-in-1", price: 2200, image: "/images/products/ecosystem_stylus_1777669337533.png", color: "#EC4899", badge: "Pocket", type: "accessory", description: "Never be without ports. A tiny but mighty hub that fits in your pocket or on your keyring." }
];

const partners = [
  { name: "IIT Delhi", logo: "/images/products/university_classroom_future_1777741050567.png", studentCount: "12,000+", location: "New Delhi, India" },
  { name: "SRM University", logo: "/images/products/human_student_tablet_1777666070007.png", studentCount: "35,000+", location: "Chennai, India" },
  { name: "Manipal Academy", logo: "/images/products/smart_panel_86_ultra_1777741249606.png", studentCount: "28,000+", location: "Manipal, India" },
  { name: "BITS Pilani", logo: "/images/products/ecosystem_panel_1777669353451.png", studentCount: "16,000+", location: "Pilani, India" },
  { name: "Amity University", logo: "/images/products/human_teacher_panel_1777666086358.png", studentCount: "45,000+", location: "Noida, India" },
  { name: "VIT Vellore", logo: "/images/products/nebula_blade_server_1777741271143.png", studentCount: "40,000+", location: "Vellore, India" }
];

const reviews = [
  { authorName: "Dr. Arun Kumar", authorRole: "Dean", collegeName: "IIT Delhi", comment: "EduSync hardware has bridged the gap between theoretical teaching and practical application. The latency-free stylus response is unmatched in the industry.", rating: 5, isApproved: true },
  { authorName: "Sneha Reddy", authorRole: "Head of Digital", collegeName: "SRM", comment: "The deployment of 5000 tablets was handled with extreme professionalism. Our students are more engaged than ever before.", rating: 5, isApproved: true },
  { authorName: "Prof. Vikram Singh", authorRole: "Director", collegeName: "BITS Pilani", comment: "Nebula Servers have simplified our complex multi-campus data synchronization challenges. A truly world-class product line.", rating: 5, isApproved: true }
];

const seedData = async () => {
  try {
    await Product.deleteMany();
    await Partner.deleteMany();
    await Review.deleteMany();

    await Product.insertMany(products);
    await Partner.insertMany(partners);
    await Review.insertMany(reviews);

    console.log('✅ 40 High-Fidelity Products seeded successfully!');
    console.log('✅ Institutional Partners & Reviews synchronized!');
    process.exit();
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
    process.exit(1);
  }
};

connectDB().then(seedData);
