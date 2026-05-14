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
  },

  // ===== PLANT CARE TOOLS & ACCESSORIES =====
  
  {
    name: "Professional Watering Can - 1L",
    description: "Premium stainless steel watering can with fine mist sprinkle head. Perfect for indoor plants with gentle water distribution to avoid soil disturbance.",
    price: 799,
    category: "accessories",
    image: "https://images.unsplash.com/photo-1563241527-3004a1f7e2d9?w=500",
    stock: 60,
    toolType: "watering-can",
    material: "Stainless Steel",
    color: "Silver",
    dimensions: "25cm x 15cm",
    weight: "500g",
    warranty: "1 year",
    features: ["Long Spout", "Fine Mist Sprinkle", "Durable", "Ergonomic Handle"]
  },

  {
    name: "Ergonomic Pruning Shears",
    description: "Professional-grade bypass pruning shears with sharp carbon steel blades. Ideal for cutting stems, branches, and deadheading with precision and minimal effort.",
    price: 1299,
    category: "accessories",
    image: "https://images.unsplash.com/photo-1589979481516-26aa1d5d2d12?w=500",
    stock: 45,
    toolType: "pruning-shears",
    material: "Carbon Steel & Aluminum",
    color: "Red & Black",
    dimensions: "20cm",
    weight: "250g",
    warranty: "2 years",
    features: ["Sharp Blades", "Ergonomic Design", "Safety Lock", "Comfortable Grip"]
  },

  {
    name: "Organic Plant Growth Fertilizer",
    description: "Balanced NPK formula (10-10-10) made from 100% organic ingredients. Perfect for all indoor and outdoor plants to promote healthy growth and vibrant foliage.",
    price: 499,
    category: "accessories",
    image: "https://images.unsplash.com/photo-1578487265807-fd49f8b0b66f?w=500",
    stock: 100,
    toolType: "fertilizer",
    material: "Organic",
    color: "Brown",
    dimensions: "500ml",
    weight: "600g",
    warranty: "6 months",
    features: ["Organic", "Balanced NPK", "Easy to Use", "Eco-Friendly"]
  },

  {
    name: "Premium Potting Soil Mix",
    description: "Specially formulated lightweight soil mix with peat, perlite, and coconut coir. Ensures excellent drainage and aeration for healthy root development.",
    price: 349,
    category: "accessories",
    image: "https://images.unsplash.com/photo-1578500878339-87b9b70ed7e1?w=500",
    stock: 80,
    toolType: "soil-mix",
    material: "Peat, Perlite, Coco Coir",
    color: "Brown",
    dimensions: "10L",
    weight: "3kg",
    warranty: "1 year",
    features: ["Lightweight", "Good Drainage", "pH Balanced", "Rich in Nutrients"]
  },

  {
    name: "Ceramic Pot with Drainage - 6 inch",
    description: "Beautiful handcrafted ceramic pot with pre-drilled drainage hole. Available in multiple colors to complement any interior decor while keeping plants healthy.",
    price: 649,
    category: "accessories",
    image: "https://images.unsplash.com/photo-1577996887594-e11c79fdebd0?w=500",
    stock: 70,
    toolType: "pot",
    material: "Ceramic",
    color: "Cream",
    dimensions: "15cm diameter x 14cm height",
    weight: "800g",
    warranty: "1 year",
    features: ["With Drainage Hole", "Handcrafted", "Durable", "Various Colors"]
  },

  {
    name: "Modern Planter Box - White",
    description: "Sleek white ceramic planter with integrated saucer. Perfect for displaying multiple small plants or creating a minimalist garden display on shelves or tables.",
    price: 1599,
    category: "accessories",
    image: "https://images.unsplash.com/photo-1578527968527-9c4e5b5d8d55?w=500",
    stock: 35,
    toolType: "planter",
    material: "Ceramic",
    color: "White",
    dimensions: "30cm x 30cm x 25cm",
    weight: "2kg",
    warranty: "2 years",
    features: ["Integrated Saucer", "Modern Design", "Spacious", "Indoor/Outdoor"]
  },

  {
    name: "Wooden Plant Stand - 3-Tier",
    description: "Sturdy wooden plant stand with three tiers to display your plant collection. Perfect for organizing plants in corners or against walls to maximize space.",
    price: 2499,
    category: "accessories",
    image: "https://images.unsplash.com/photo-1612538498055-fdcd22dd8e9d?w=500",
    stock: 25,
    toolType: "stand",
    material: "Bamboo Wood",
    color: "Natural",
    dimensions: "60cm x 60cm x 90cm",
    weight: "5kg",
    warranty: "2 years",
    features: ["3 Tiers", "Sturdy", "Space Saving", "Easy Assembly"]
  },

  {
    name: "Plant Mister Spray Bottle - 500ml",
    description: "Heavy-duty plastic spray bottle with adjustable mist pattern. Essential for maintaining humidity levels for tropical plants and regular misting without overwatering.",
    price: 299,
    category: "accessories",
    image: "https://images.unsplash.com/photo-1563241527-0d4d3c78db00?w=500",
    stock: 120,
    toolType: "mister",
    material: "BPA-Free Plastic",
    color: "Clear",
    dimensions: "500ml",
    weight: "150g",
    warranty: "1 year",
    features: ["Adjustable Mist", "Easy to Use", "Durable", "Ergonomic Design"]
  },

  {
    name: "Wooden Garden Tool Set - 3 Pieces",
    description: "Compact set including hand spade, small rake, and weeder. Perfect for repotting, soil preparation, and detailed garden work for indoor or outdoor containers.",
    price: 899,
    category: "accessories",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=500",
    stock: 50,
    toolType: "spade",
    material: "Wood & Stainless Steel",
    color: "Brown & Silver",
    dimensions: "20cm - 25cm handles",
    weight: "800g",
    warranty: "1 year",
    compatible: ["All pot sizes", "Indoor and outdoor use"],
    features: ["3-in-1 Set", "Ergonomic", "Durable", "Easy Storage"]
  },

  {
    name: "Protective Garden Gloves",
    description: "Breathable cotton gloves with reinforced synthetic leather palms. Protects hands from thorns, soil, and chemicals while pruning or repotting plants.",
    price: 399,
    category: "accessories",
    image: "https://images.unsplash.com/photo-1582053273283-4e5dd036df37?w=500",
    stock: 90,
    toolType: "gloves",
    material: "Cotton & Synthetic Leather",
    color: "Green",
    dimensions: "One size fits all",
    weight: "100g",
    warranty: "6 months",
    features: ["Breathable", "Reinforced Palm", "Comfortable", "Washable"]
  },

  {
    name: "Moss Trellis for Climbing Plants",
    description: "Natural moss pole wrapped around wooden core. Perfect support structure for climbing and vining plants like Monsteras, Philodendrons, and Pothos.",
    price: 1899,
    category: "accessories",
    image: "https://images.unsplash.com/photo-1570968915860-54d8d3532ca0?w=500",
    stock: 30,
    toolType: "trellis",
    material: "Natural Moss & Wood",
    color: "Green & Brown",
    dimensions: "60cm height x 10cm diameter",
    weight: "1.2kg",
    warranty: "1 year",
    compatible: ["Monstera", "Philodendron", "Pothos", "Other climbing plants"],
    features: ["Natural Moss", "Aerial Root Support", "Biodegradable", "Promotes Growth"]
  },

  {
    name: "Analog Soil Moisture Meter",
    description: "Simple and reliable moisture meter to accurately measure soil moisture levels. No batteries needed - just insert into soil for instant reading to prevent over/under watering.",
    price: 599,
    category: "accessories",
    image: "https://images.unsplash.com/photo-1537462715957-37d63d94b77e?w=500",
    stock: 65,
    toolType: "moisture-meter",
    material: "Aluminum & Plastic",
    color: "Silver",
    dimensions: "20cm length",
    weight: "100g",
    warranty: "1 year",
    features: ["No Batteries", "Accurate", "Easy to Use", "Durable"]
  },

  {
    name: "Digital Thermometer & Hygrometer",
    description: "Electronic device to monitor temperature and humidity levels simultaneously. Essential for creating optimal growing conditions for tropical and sensitive plants.",
    price: 1099,
    category: "accessories",
    image: "https://images.unsplash.com/photo-1589519160732-57fc498494f8?w=500",
    stock: 40,
    toolType: "thermometer",
    material: "Plastic & LCD",
    color: "White",
    dimensions: "10cm x 5cm",
    weight: "50g",
    warranty: "1 year",
    features: ["Digital Display", "Temperature", "Humidity", "Battery Powered"]
  },

  {
    name: "LED Grow Light - 15W",
    description: "Energy-efficient LED grow light with full spectrum for indoor plants. Features adjustable brightness and 3 time modes to provide optimal light cycles for photosynthesis.",
    price: 2299,
    category: "accessories",
    image: "https://images.unsplash.com/photo-1518656306566-f2b94f40a426?w=500",
    stock: 35,
    toolType: "light",
    material: "Aluminum & LED",
    color: "Black",
    dimensions: "30cm x 15cm",
    weight: "500g",
    warranty: "2 years",
    features: ["Full Spectrum", "Adjustable Brightness", "3 Time Modes", "Energy Efficient"]
  },

  {
    name: "Plant Support Stakes Set - 10 Pack",
    description: "Bamboo plant support stakes ideal for staking tall or climbing plants. Help maintain plant shape and provide necessary support as plants grow taller.",
    price: 449,
    category: "accessories",
    image: "https://images.unsplash.com/photo-1599599810694-b5ac4dd5b2d1?w=500",
    stock: 100,
    toolType: "other",
    material: "Bamboo",
    color: "Natural Brown",
    dimensions: "60cm length",
    weight: "200g",
    warranty: "1 year",
    compatible: ["All climbing plants", "Tall plants"],
    features: ["Set of 10", "Eco-Friendly", "Biodegradable", "Reusable"]
  },

  {
    name: "Neem Oil Plant Spray - 500ml",
    description: "100% pure neem oil for organic pest control. Effectively treats spider mites, mealybugs, scale, and other common plant pests without harmful chemicals.",
    price: 649,
    category: "accessories",
    image: "https://images.unsplash.com/photo-1584622714792-3d6bb7d8e9b2?w=500",
    stock: 55,
    toolType: "fertilizer",
    material: "Pure Neem Oil",
    color: "Brown",
    dimensions: "500ml",
    weight: "500g",
    warranty: "1 year",
    features: ["100% Organic", "Pest Control", "No Chemicals", "Easy to Use"]
  }
];

async function seedDatabase() {
  try {
    await connectDB();
    
    // console.log('🗑️  Clearing existing products...');
    await Product.deleteMany({});
    
    // console.log('🌱 Seeding products...');
    const products = await Product.insertMany(sampleProducts);
    
    // console.log(`✅ Successfully seeded ${products.length} products!`);
    // console.log('\nSample Products:');
    products.forEach(product => {
      // console.log(`  - ${product.name} (${product.category}) - ₹${product.price / 100}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
