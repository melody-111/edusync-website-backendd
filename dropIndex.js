require('dotenv').config();
const mongoose = require('mongoose');

const dropIndex = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;
    await db.collection('products').dropIndex('slug_1');
    console.log('Index slug_1 dropped successfully!');
    process.exit();
  } catch (err) {
    console.error('Error dropping index:', err.message);
    process.exit(1);
  }
};

dropIndex();
