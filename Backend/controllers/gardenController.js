import GardenPlant from '../models/GardenPlant.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

const PLANT_CATEGORIES = new Set(['indoor', 'outdoor', 'succulents']);

const CARE_DEFAULTS = {
  indoor: { wateringIntervalDays: 7, fertilizingIntervalDays: 30, repottingIntervalDays: 180 },
  outdoor: { wateringIntervalDays: 5, fertilizingIntervalDays: 21, repottingIntervalDays: 180 },
  succulents: { wateringIntervalDays: 14, fertilizingIntervalDays: 45, repottingIntervalDays: 365 },
};

const addDays = (date, days) => {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
};

const getCareDefaults = (category) => {
  return CARE_DEFAULTS[category] || CARE_DEFAULTS.indoor;
};

const buildTimelineEntry = (type, title, description, meta = {}) => ({
  type,
  title,
  description,
  meta,
  createdAt: new Date(),
});

const calculateReminderItems = (gardenPlant) => {
  const reminderItems = [];
  const now = new Date();
  const reminderWindowMs = 7 * 24 * 60 * 60 * 1000;

  const reminderSources = [
    {
      type: 'watering',
      label: 'Water plant',
      dueAt: gardenPlant.nextWateringAt,
      tone: 'water',
    },
    {
      type: 'fertilizing',
      label: 'Fertilize plant',
      dueAt: gardenPlant.nextFertilizingAt,
      tone: 'fertilize',
    },
    {
      type: 'repotting',
      label: 'Repot plant',
      dueAt: gardenPlant.nextRepottingAt,
      tone: 'repot',
    },
  ];

  reminderSources.forEach((item) => {
    if (!item.dueAt) {
      return;
    }

    const dueDate = new Date(item.dueAt);
    const timeDifference = dueDate.getTime() - now.getTime();

    if (timeDifference <= reminderWindowMs) {
      reminderItems.push({
        type: item.type,
        tone: item.tone,
        label: item.label,
        dueAt: dueDate,
        daysRemaining: Math.ceil(timeDifference / (24 * 60 * 60 * 1000)),
        isOverdue: timeDifference < 0,
        title: gardenPlant.product?.name || 'Plant',
        message:
          timeDifference < 0
            ? `${gardenPlant.product?.name || 'This plant'} is overdue for ${item.type}.`
            : `${gardenPlant.product?.name || 'This plant'} needs ${item.type} in the next few days.`,
      });
    }
  });

  return reminderItems;
};

const serializeGardenPlant = (gardenPlant) => {
  const reminders = calculateReminderItems(gardenPlant);

  return {
    _id: gardenPlant._id,
    product: gardenPlant.product,
    order: gardenPlant.order,
    quantity: gardenPlant.quantity,
    sourceType: gardenPlant.sourceType,
    purchaseSource: gardenPlant.purchaseSource,
    addedAt: gardenPlant.addedAt,
    lastWateredAt: gardenPlant.lastWateredAt,
    nextWateringAt: gardenPlant.nextWateringAt,
    wateringIntervalDays: gardenPlant.wateringIntervalDays,
    lastFertilizedAt: gardenPlant.lastFertilizedAt,
    nextFertilizingAt: gardenPlant.nextFertilizingAt,
    fertilizingIntervalDays: gardenPlant.fertilizingIntervalDays,
    lastRepottedAt: gardenPlant.lastRepottedAt,
    nextRepottingAt: gardenPlant.nextRepottingAt,
    repottingIntervalDays: gardenPlant.repottingIntervalDays,
    healthStatus: gardenPlant.healthStatus,
    notes: gardenPlant.notes || [],
    timeline: gardenPlant.timeline || [],
    reminders,
    attentionNeeded: reminders.length > 0 || gardenPlant.healthStatus !== 'healthy',
    careSummary: {
      lastWateredAt: gardenPlant.lastWateredAt,
      nextWateringAt: gardenPlant.nextWateringAt,
      lastFertilizedAt: gardenPlant.lastFertilizedAt,
      nextFertilizingAt: gardenPlant.nextFertilizingAt,
      lastRepottedAt: gardenPlant.lastRepottedAt,
      nextRepottingAt: gardenPlant.nextRepottingAt,
    },
  };
};

const calculateSummary = (gardenPlants) => {
  const totalPlants = gardenPlants.length;
  const healthyPlants = gardenPlants.filter((plant) => plant.healthStatus === 'healthy').length;
  const attentionPlants = gardenPlants.filter((plant) => {
    const reminders = calculateReminderItems(plant);
    return reminders.length > 0 || plant.healthStatus !== 'healthy';
  }).length;
  const reminders = gardenPlants.flatMap((plant) => calculateReminderItems(plant));

  return {
    totalPlants,
    healthyPlants,
    attentionPlants,
    reminderCount: reminders.length,
  };
};

const syncMissingDeliveredOrders = async (userId) => {
  const existingGardenPlants = await GardenPlant.find({ user: userId, sourceType: 'order' }).select('order product');
  const syncedOrderIds = new Set(
    existingGardenPlants
      .map((gardenPlant) => gardenPlant.order)
      .filter(Boolean)
      .map((orderId) => orderId.toString())
  );

  const deliveredOrders = await Order.find({ user: userId, orderStatus: 'delivered' })
    .select('_id orderNumber items orderStatus')
    .populate('items.product', 'name image price category stock isActive');

  const missingOrders = deliveredOrders.filter((order) => !syncedOrderIds.has(order._id.toString()));

  for (const order of missingOrders) {
    await syncGardenPlantsFromOrder(userId, order);
  }
};

const ensurePlantProduct = async (productId) => {
  const product = await Product.findById(productId);

  if (!product) {
    return { error: 'Product not found' };
  }

  if (!PLANT_CATEGORIES.has(product.category)) {
    return { error: 'Only plants can be added to the garden' };
  }

  if (!product.isActive) {
    return { error: 'Product is no longer available' };
  }

  return { product };
};

const upsertGardenPlant = async ({ userId, product, quantity = 1, sourceType = 'manual', purchaseSource, orderId = null, timelineType, timelineTitle, timelineDescription }) => {
  const careDefaults = getCareDefaults(product.category);
  const now = new Date();

  let gardenPlant = await GardenPlant.findOne({ user: userId, product: product._id });

  if (!gardenPlant) {
    gardenPlant = await GardenPlant.create({
      user: userId,
      product: product._id,
      order: orderId,
      quantity,
      sourceType,
      purchaseSource,
      addedAt: now,
      wateringIntervalDays: careDefaults.wateringIntervalDays,
      fertilizingIntervalDays: careDefaults.fertilizingIntervalDays,
      repottingIntervalDays: careDefaults.repottingIntervalDays,
      lastWateredAt: null,
      nextWateringAt: addDays(now, careDefaults.wateringIntervalDays),
      lastFertilizedAt: null,
      nextFertilizingAt: addDays(now, careDefaults.fertilizingIntervalDays),
      lastRepottedAt: null,
      nextRepottingAt: addDays(now, careDefaults.repottingIntervalDays),
      healthStatus: 'healthy',
      notes: [],
      timeline: [
        buildTimelineEntry(
          timelineType,
          timelineTitle,
          timelineDescription,
          { sourceType, quantity, orderId }
        ),
      ],
    });
  } else {
    gardenPlant.quantity += quantity;
    gardenPlant.sourceType = sourceType || gardenPlant.sourceType;
    gardenPlant.purchaseSource = purchaseSource || gardenPlant.purchaseSource;
    if (orderId) {
      gardenPlant.order = orderId;
    }
    gardenPlant.timeline.unshift(
      buildTimelineEntry(
        timelineType,
        timelineTitle,
        timelineDescription,
        { sourceType, quantity, orderId }
      )
    );
    await gardenPlant.save();
  }

  return gardenPlant.populate('product', 'name image price category stock isActive');
};

export const getGardenPlants = async (req, res) => {
  try {
    await syncMissingDeliveredOrders(req.user.id);

    const gardenPlants = await GardenPlant.find({ user: req.user.id })
      .sort({ updatedAt: -1 })
      .populate('product', 'name image price category stock isActive')
      .populate('order', 'orderNumber createdAt orderStatus');

    const visiblePlants = gardenPlants.filter((plant) => {
      if (plant.sourceType !== 'order') {
        return true;
      }

      return plant.order && plant.order.orderStatus === 'delivered';
    });

    const serializedPlants = visiblePlants.map((plant) => serializeGardenPlant(plant));
    const reminders = serializedPlants.flatMap((plant) => plant.reminders);

    res.status(200).json({
      success: true,
      gardenPlants: serializedPlants,
      reminders,
      summary: calculateSummary(visiblePlants),
    });
  } catch (error) {
    console.error('Get Garden Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

export const addGardenPlant = async (req, res) => {
  try {
    const { productId, quantity = 1, purchaseSource = 'Manual Add', orderId = null } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product is required',
      });
    }

    const { product, error } = await ensurePlantProduct(productId);
    if (error) {
      return res.status(400).json({ success: false, message: error });
    }

    const gardenPlant = await upsertGardenPlant({
      userId: req.user.id,
      product,
      quantity: Number(quantity) || 1,
      sourceType: 'manual',
      purchaseSource,
      orderId,
      timelineType: 'added',
      timelineTitle: 'Plant added',
      timelineDescription: `${product.name} was added to the garden.`,
    });

    res.status(201).json({
      success: true,
      message: 'Plant added to garden',
      gardenPlant: serializeGardenPlant(gardenPlant),
    });
  } catch (error) {
    console.error('Add Garden Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

export const moveWishlistToGarden = async (req, res) => {
  try {
    const { productId } = req.params;

    const { product, error } = await ensurePlantProduct(productId);
    if (error) {
      return res.status(400).json({ success: false, message: error });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.wishlist = user.wishlist.filter((itemId) => itemId.toString() !== productId);
    await user.save();

    const gardenPlant = await upsertGardenPlant({
      userId: req.user.id,
      product,
      quantity: 1,
      sourceType: 'wishlist',
      purchaseSource: 'Moved from Wishlist',
      timelineType: 'wishlist_moved',
      timelineTitle: 'Moved from wishlist',
      timelineDescription: `${product.name} moved from wishlist to your garden.`,
    });

    const updatedUser = await User.findById(req.user.id)
      .select('-password')
      .populate('wishlist', 'name image price category stock isActive');

    res.status(200).json({
      success: true,
      message: 'Plant moved to garden',
      gardenPlant: serializeGardenPlant(gardenPlant),
      user: updatedUser,
    });
  } catch (error) {
    console.error('Move Wishlist To Garden Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

export const updateGardenPlant = async (req, res) => {
  try {
    const gardenPlant = await GardenPlant.findOne({
      _id: req.params.id,
      user: req.user.id,
    }).populate('product', 'name image price category stock isActive');

    if (!gardenPlant) {
      return res.status(404).json({
        success: false,
        message: 'Garden plant not found',
      });
    }

    const {
      healthStatus,
      wateringIntervalDays,
      fertilizingIntervalDays,
      repottingIntervalDays,
    } = req.body;

    const updates = {};
    if (healthStatus) updates.healthStatus = healthStatus;
    if (wateringIntervalDays) updates.wateringIntervalDays = Number(wateringIntervalDays);
    if (fertilizingIntervalDays) updates.fertilizingIntervalDays = Number(fertilizingIntervalDays);
    if (repottingIntervalDays) updates.repottingIntervalDays = Number(repottingIntervalDays);

    Object.assign(gardenPlant, updates);

    if (healthStatus) {
      gardenPlant.timeline.unshift(
        buildTimelineEntry(
          'status_changed',
          'Health status updated',
          `${gardenPlant.product?.name || 'Plant'} health status changed to ${healthStatus}.`,
          { healthStatus }
        )
      );
    }

    if (wateringIntervalDays || fertilizingIntervalDays || repottingIntervalDays) {
      gardenPlant.timeline.unshift(
        buildTimelineEntry(
          'care_updated',
          'Care tracker updated',
          `${gardenPlant.product?.name || 'Plant'} care tracking intervals were updated.`,
          updates
        )
      );
    }

    await gardenPlant.save();

    const refreshedPlant = await GardenPlant.findById(gardenPlant._id)
      .populate('product', 'name image price category stock isActive')
      .populate('order', 'orderNumber createdAt orderStatus');

    res.status(200).json({
      success: true,
      message: 'Garden plant updated',
      gardenPlant: serializeGardenPlant(refreshedPlant),
    });
  } catch (error) {
    console.error('Update Garden Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

export const logGardenCare = async (req, res) => {
  try {
    const { action } = req.body;

    const gardenPlant = await GardenPlant.findOne({
      _id: req.params.id,
      user: req.user.id,
    }).populate('product', 'name image price category stock isActive');

    if (!gardenPlant) {
      return res.status(404).json({
        success: false,
        message: 'Garden plant not found',
      });
    }

    const now = new Date();
    const actionMap = {
      watered: {
        lastField: 'lastWateredAt',
        nextField: 'nextWateringAt',
        intervalField: 'wateringIntervalDays',
        title: 'Watered plant',
        type: 'watered',
        description: `${gardenPlant.product?.name || 'Plant'} was watered.`,
      },
      fertilized: {
        lastField: 'lastFertilizedAt',
        nextField: 'nextFertilizingAt',
        intervalField: 'fertilizingIntervalDays',
        title: 'Fertilized plant',
        type: 'fertilized',
        description: `${gardenPlant.product?.name || 'Plant'} was fertilized.`,
      },
      repotted: {
        lastField: 'lastRepottedAt',
        nextField: 'nextRepottingAt',
        intervalField: 'repottingIntervalDays',
        title: 'Repotted plant',
        type: 'repotted',
        description: `${gardenPlant.product?.name || 'Plant'} was repotted.`,
      },
    };

    const selectedAction = actionMap[action];

    if (!selectedAction) {
      return res.status(400).json({
        success: false,
        message: 'Invalid care action',
      });
    }

    const intervalDays = gardenPlant[selectedAction.intervalField] || 7;
    gardenPlant[selectedAction.lastField] = now;
    gardenPlant[selectedAction.nextField] = addDays(now, intervalDays);
    gardenPlant.timeline.unshift(
      buildTimelineEntry(
        selectedAction.type,
        selectedAction.title,
        selectedAction.description,
        { intervalDays }
      )
    );

    if (action === 'watered') {
      gardenPlant.healthStatus = 'healthy';
    }

    await gardenPlant.save();

    const refreshedPlant = await GardenPlant.findById(gardenPlant._id)
      .populate('product', 'name image price category stock isActive')
      .populate('order', 'orderNumber createdAt orderStatus');

    res.status(200).json({
      success: true,
      message: `${action} recorded successfully`,
      gardenPlant: serializeGardenPlant(refreshedPlant),
    });
  } catch (error) {
    console.error('Log Garden Care Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

export const addGardenNote = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Note text is required',
      });
    }

    const gardenPlant = await GardenPlant.findOne({
      _id: req.params.id,
      user: req.user.id,
    }).populate('product', 'name image price category stock isActive');

    if (!gardenPlant) {
      return res.status(404).json({
        success: false,
        message: 'Garden plant not found',
      });
    }

    const note = {
      text: text.trim(),
      createdAt: new Date(),
    };

    gardenPlant.notes.unshift(note);
    gardenPlant.timeline.unshift(
      buildTimelineEntry(
        'note',
        'Note added',
        `A journal note was added for ${gardenPlant.product?.name || 'this plant'}.`,
        { note: note.text }
      )
    );

    await gardenPlant.save();

    const refreshedPlant = await GardenPlant.findById(gardenPlant._id)
      .populate('product', 'name image price category stock isActive')
      .populate('order', 'orderNumber createdAt');

    res.status(200).json({
      success: true,
      message: 'Note added',
      gardenPlant: serializeGardenPlant(refreshedPlant),
    });
  } catch (error) {
    console.error('Add Garden Note Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

export const deleteGardenPlant = async (req, res) => {
  try {
    const gardenPlant = await GardenPlant.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!gardenPlant) {
      return res.status(404).json({
        success: false,
        message: 'Garden plant not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Plant removed from garden',
    });
  } catch (error) {
    console.error('Delete Garden Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

export const syncGardenPlantsFromOrder = async (userId, order) => {
  try {
    if (!order || !Array.isArray(order.items)) {
      return [];
    }

    const syncedPlants = [];
    const user = await User.findById(userId);

    for (const item of order.items) {
      if (!item.category || !PLANT_CATEGORIES.has(item.category)) {
        continue;
      }

      const product = await Product.findById(item.product);
      if (!product || !product.isActive) {
        continue;
      }

      const purchaseSource = `Order #${order.orderNumber}`;
      const gardenPlant = await upsertGardenPlant({
        userId,
        product,
        quantity: item.quantity || 1,
        sourceType: 'order',
        purchaseSource,
        orderId: order._id,
        timelineType: 'order_linked',
        timelineTitle: 'Purchased in order',
        timelineDescription: `${product.name} was added to the garden from ${purchaseSource}.`,
      });

      syncedPlants.push(gardenPlant._id);

      if (user) {
        user.wishlist = user.wishlist.filter((wishlistId) => wishlistId.toString() !== product._id.toString());
      }
    }

    if (user) {
      await user.save();
    }

    return syncedPlants;
  } catch (error) {
    console.error('Sync Garden From Order Error:', error);
    return [];
  }
};
