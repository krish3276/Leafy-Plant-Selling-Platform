import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [100, 'Product name cannot exceed 100 characters'],
    },

    description: {
      type: String,
      required: [true, 'Product description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },

    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
    },

    category: {
      type: String,
      required: [true, 'Product category is required'],
      enum: ['indoor', 'outdoor', 'succulents', 'accessories'],
    },

    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400',
    },

    stock: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },

    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },

    sunlight: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },

    waterFrequency: {
      type: String,
      default: 'Once a week',
    },

    size: {
      type: String,
      enum: ['small', 'medium', 'large'],
      default: 'medium',
    },

    features: [
      {
        type: String,
      },
    ],

    // Tool/Accessory specific fields
    toolType: {
      type: String,
      enum: [
        'watering-can',
        'pruning-shears',
        'soil-mix',
        'pot',
        'planter',
        'stand',
        'trellis',
        'mister',
        'fertilizer',
        'gloves',
        'spade',
        'rake',
        'light',
        'thermometer',
        'moisture-meter',
        'other'
      ],
      default: null,
    },

    material: {
      type: String,
      default: null,
    },

    color: {
      type: String,
      default: null,
    },

    dimensions: {
      type: String,
      default: null,
    },

    weight: {
      type: String,
      default: null,
    },

    warranty: {
      type: String,
      default: '1 year',
    },

    compatible: [
      {
        type: String,
      },
    ],

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        name: String,
        rating: Number,
        comment: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);

export default Product;
