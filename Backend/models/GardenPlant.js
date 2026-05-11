import mongoose from 'mongoose';

const gardenNoteSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      maxlength: [500, 'Note cannot exceed 500 characters'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const gardenTimelineSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['added', 'order_linked', 'wishlist_moved', 'watered', 'fertilized', 'repotted', 'note', 'status_changed', 'care_updated'],
      required: true,
    },
    title: {
      type: String,
      required: true,
      maxlength: [120, 'Timeline title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      required: true,
      maxlength: [300, 'Timeline description cannot exceed 300 characters'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    meta: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { _id: true }
);

const gardenPlantSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      default: null,
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1,
    },
    sourceType: {
      type: String,
      enum: ['order', 'wishlist', 'manual'],
      default: 'manual',
    },
    purchaseSource: {
      type: String,
      required: true,
      maxlength: [120, 'Purchase source cannot exceed 120 characters'],
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
    lastWateredAt: {
      type: Date,
      default: null,
    },
    nextWateringAt: {
      type: Date,
      default: null,
    },
    wateringIntervalDays: {
      type: Number,
      default: 7,
    },
    lastFertilizedAt: {
      type: Date,
      default: null,
    },
    nextFertilizingAt: {
      type: Date,
      default: null,
    },
    fertilizingIntervalDays: {
      type: Number,
      default: 30,
    },
    lastRepottedAt: {
      type: Date,
      default: null,
    },
    nextRepottingAt: {
      type: Date,
      default: null,
    },
    repottingIntervalDays: {
      type: Number,
      default: 180,
    },
    healthStatus: {
      type: String,
      enum: ['healthy', 'needs_water', 'pest_warning', 'low_light'],
      default: 'healthy',
    },
    notes: [gardenNoteSchema],
    timeline: [gardenTimelineSchema],
  },
  {
    timestamps: true,
  }
);

gardenPlantSchema.index({ user: 1, product: 1 }, { unique: true });

const GardenPlant = mongoose.model('GardenPlant', gardenPlantSchema);

export default GardenPlant;
