import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('❌ MongoDB Connection Error: MONGODB_URI is not defined in environment');
      process.exit(1);
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, {});

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database Name: ${conn.connection.name}`);
    
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
