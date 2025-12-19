import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Product from '../models/Product.js';
import connectDB from '../config/database.js';

dotenv.config();

const sampleProducts = [
  {
    name: "Monstera Deliciosa",
    description: "The Swiss Cheese Plant is a stunning tropical plant with large, glossy, heart-shaped leaves that develop dramatic splits and holes as they mature. Perfect for adding a bold statement to any room.",
    price: 2999,
    category: "indoor",
    image: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=500",
    stock: 25,
    difficulty: "easy",
    sunlight: "medium",
    waterFrequency: "Weekly",
    size: "medium",
    features: ["Air Purifying", "Pet-Friendly Warning", "Fast Growing"]
  },
  {
    name: "Snake Plant (Sansevieria)",
    description: "One of the most resilient houseplants, the Snake Plant features striking upright leaves with beautiful variegation. It thrives on neglect and purifies air effectively.",
    price: 1499,
    category: "indoor",
    image: "https://images.unsplash.com/photo-1593482892290-f54927ae1bb6?w=500",
    stock: 40,
    difficulty: "easy",
    sunlight: "low",
    waterFrequency: "Bi-weekly",
    size: "small",
    features: ["Air Purifying", "Low Maintenance", "Drought Tolerant"]
  },
  {
    name: "Fiddle Leaf Fig",
    description: "A trendy indoor tree with large, violin-shaped leaves. This statement plant adds instant sophistication and brings a touch of nature's elegance to modern interiors.",
    price: 4999,
    category: "indoor",
    image: "https://images.unsplash.com/photo-1598880940371-c756e015faf4?w=500",
    stock: 15,
    difficulty: "medium",
    sunlight: "high",
    waterFrequency: "Weekly",
    size: "large",
    features: ["Statement Piece", "Air Purifying"]
  },
  {
    name: "Pothos Golden",
    description: "A trailing vine with heart-shaped golden and green variegated leaves. Perfect for hanging baskets or shelves, this low-maintenance beauty purifies air while adding cascading greenery.",
    price: 899,
    category: "indoor",
    image: "https://images.unsplash.com/photo-1587655149522-6bed34388b90?w=500",
    stock: 50,
    difficulty: "easy",
    sunlight: "low",
    waterFrequency: "Weekly",
    size: "small",
    features: ["Air Purifying", "Trailing", "Low Maintenance"]
  },
  {
    name: "Succulent Collection",
    description: "A curated collection of 5 different succulent varieties in a decorative planter. These desert beauties require minimal care and add modern charm to any space.",
    price: 1299,
    category: "succulents",
    image: "https://images.unsplash.com/photo-1459156212016-c812468e2115?w=500",
    stock: 35,
    difficulty: "easy",
    sunlight: "high",
    waterFrequency: "Bi-weekly",
    size: "small",
    features: ["Drought Tolerant", "Low Maintenance", "Decorative"]
  },
  {
    name: "Peace Lily",
    description: "Elegant white blooms and glossy dark green leaves make this a classic choice. The Peace Lily is excellent at removing toxins and thrives in low-light conditions.",
    price: 1899,
    category: "indoor",
    image: "https://images.unsplash.com/photo-1593691509543-c55fb32d8de5?w=500",
    stock: 30,
    difficulty: "easy",
    sunlight: "low",
    waterFrequency: "Weekly",
    size: "medium",
    features: ["Air Purifying", "Flowering", "Low Light Tolerant"]
  },
  {
    name: "Aloe Vera",
    description: "A medicinal succulent with thick, gel-filled leaves. Known for its healing properties, Aloe Vera is both decorative and functional, thriving with minimal care.",
    price: 799,
    category: "succulents",
    image: "https://images.unsplash.com/photo-1596556962291-d802c9e4ca84?w=500",
    stock: 45,
    difficulty: "easy",
    sunlight: "high",
    waterFrequency: "Bi-weekly",
    size: "small",
    features: ["Medicinal", "Drought Tolerant", "Low Maintenance"]
  },
  {
    name: "ZZ Plant",
    description: "The Zamioculcas Zamiifolia features glossy, dark green leaves on graceful stems. This nearly indestructible plant tolerates low light and irregular watering perfectly.",
    price: 2499,
    category: "indoor",
    image: "https://images.unsplash.com/photo-1632207691143-643e2a9a9361?w=500",
    stock: 28,
    difficulty: "easy",
    sunlight: "low",
    waterFrequency: "Bi-weekly",
    size: "medium",
    features: ["Air Purifying", "Drought Tolerant", "Low Maintenance"]
  },
  {
    name: "Boston Fern",
    description: "Lush, feathery fronds create a romantic, Victorian-era appeal. This humidity-loving fern is perfect for bathrooms or kitchens, bringing soft texture to your space.",
    price: 1699,
    category: "outdoor",
    image: "https://images.unsplash.com/photo-1585318419759-68d86c6b4597?w=500",
    stock: 22,
    difficulty: "medium",
    sunlight: "medium",
    waterFrequency: "2-3 times weekly",
    size: "medium",
    features: ["Air Purifying", "Humidity Loving"]
  },
  {
    name: "Rubber Plant",
    description: "Bold, burgundy-tinged leaves make this a striking focal point. The Rubber Plant is easy to care for and grows into an impressive indoor tree with proper care.",
    price: 3499,
    category: "indoor",
    image: "https://images.unsplash.com/photo-1610768764270-790fbec18178?w=500",
    stock: 18,
    difficulty: "easy",
    sunlight: "high",
    waterFrequency: "Weekly",
    size: "large",
    features: ["Air Purifying", "Statement Piece"]
  },
  {
    name: "String of Pearls",
    description: "Unique trailing succulent with bead-like leaves cascading down like a living necklace. A conversation starter that's surprisingly easy to care for.",
    price: 1399,
    category: "succulents",
    image: "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=500",
    stock: 20,
    difficulty: "easy",
    sunlight: "medium",
    waterFrequency: "Bi-weekly",
    size: "small",
    features: ["Trailing", "Unique Appearance", "Drought Tolerant"]
  },
  {
    name: "Bird of Paradise",
    description: "Tropical beauty with large, banana-like leaves that create a dramatic jungle atmosphere. This plant makes a bold architectural statement in spacious rooms.",
    price: 5999,
    category: "indoor",
    image: "https://images.unsplash.com/photo-1545664394-002e144f9d49?w=500",
    stock: 10,
    difficulty: "medium",
    sunlight: "high",
    waterFrequency: "Weekly",
    size: "large",
    features: ["Statement Piece", "Tropical"]
  }
];

async function seedDatabase() {
  try {
    await connectDB();
    
    console.log('🗑️  Clearing existing products...');
    await Product.deleteMany({});
    
    console.log('🌱 Seeding products...');
    const products = await Product.insertMany(sampleProducts);
    
    console.log(`✅ Successfully seeded ${products.length} products!`);
    console.log('\nSample Products:');
    products.forEach(product => {
      console.log(`  - ${product.name} (${product.category}) - ₹${product.price / 100}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
