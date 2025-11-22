const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('./models/User');
const connectDB = require('./config/database');

const seedAdmin = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Check if admin already exists
    let admin = await User.findOne({ email: 'admin@example.com' });
    
    if (admin) {
      console.log('✅ Admin user already exists');
      process.exit(0);
    }
    
    // Create new admin user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    admin = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
      isActive: true,
    });
    
    await admin.save();
    console.log('✅ Admin user created successfully');
    console.log('📧 Email: admin@example.com');
    console.log('🔑 Password: admin123');
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding database:', err.message);
    process.exit(1);
  }
};

seedAdmin();
