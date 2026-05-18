import dotenv from 'dotenv';
import connectDB from '../config/database.js';
import Product from '../models/Product.js';

dotenv.config();

const cleanupAccessoryPlantFields = async () => {
  try {
    await connectDB();

    const result = await Product.updateMany(
      { category: 'accessories' },
      {
        $unset: {
          difficulty: '',
          sunlight: '',
        },
      }
    );

    console.log(`Updated ${result.modifiedCount} accessory product(s).`);
    process.exit(0);
  } catch (error) {
    console.error('Accessory cleanup failed:', error.message);
    process.exit(1);
  }
};

cleanupAccessoryPlantFields();