/**
 * 🔐 ADMIN SEED SCRIPT
 * Creates an initial admin account for the Leafy Plant Selling Platform
 * 
 * Run with: npm run seed:admin
 */

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import connectDB from '../config/database.js';

dotenv.config();

const createAdminAccount = async () => {
  try {
    // console.log('🔐 Starting Admin Account Creation...\n');

    // Connect to database
    await connectDB();
    // console.log('✅ Connected to MongoDB\n');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@leafy.com' });
    
    if (existingAdmin) {
      // console.log('⚠️  Admin account already exists!');
      // console.log('📧 Email: admin@leafy.com');
      // console.log('🔑 Password: (already set)');
      // console.log('\n💡 To reset admin password, delete the existing admin user and run this script again.');
      process.exit(0);
    }

    // Create admin user
    const adminUser = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@leafy.com',
      password: 'Admin@123456', // Will be hashed by pre-save middleware
      role: 'admin',
      isActive: true,
      phone: '+91-9000000000',
      address: 'Leafy Headquarters, India',
    });

    // console.log('✅ Admin Account Created Successfully!\n');
    // console.log('═════════════════════════════════════════════');
    // console.log('🎉 ADMIN LOGIN CREDENTIALS');
    // console.log('═════════════════════════════════════════════\n');
    // console.log('📧 Email:    admin@leafy.com');
    // console.log('🔑 Password: Admin@123456\n');
    // console.log('═══

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin account:', error.message);
    if (error.code === 11000) {
      console.error('⚠️  Email already exists in database');
    }
    process.exit(1);
  }
};

// Run the script
createAdminAccount();
