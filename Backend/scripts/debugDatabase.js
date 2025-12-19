/**
 * 🔍 DEBUG SCRIPT - Check database connection and existing users
 */

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import connectDB from '../config/database.js';

dotenv.config();

const debugDatabase = async () => {
  try {
    console.log('🔍 Starting Debug Check...\n');
    
    // Connect to database
    await connectDB();
    console.log('✅ Connected to MongoDB\n');

    // Check if any admin exists
    const adminUsers = await User.find({ role: 'admin' });
    console.log(`📊 Total Admin Users: ${adminUsers.length}\n`);

    if (adminUsers.length > 0) {
      console.log('📋 Existing Admin Users:');
      adminUsers.forEach((admin, index) => {
        console.log(`${index + 1}. Email: ${admin.email}, Active: ${admin.isActive}`);
      });
    }

    // Check if admin@leafy.com exists
    const leafyAdmin = await User.findOne({ email: 'admin@leafy.com' });
    if (leafyAdmin) {
      console.log('\n✅ admin@leafy.com EXISTS in database');
      console.log(`   Name: ${leafyAdmin.firstName} ${leafyAdmin.lastName}`);
      console.log(`   Role: ${leafyAdmin.role}`);
      console.log(`   Active: ${leafyAdmin.isActive}`);
      console.log(`   Created: ${leafyAdmin.createdAt}`);
    } else {
      console.log('\n❌ admin@leafy.com NOT found in database');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Debug Error:', error.message);
    process.exit(1);
  }
};

debugDatabase();
