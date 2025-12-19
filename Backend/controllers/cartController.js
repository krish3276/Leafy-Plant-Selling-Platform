import User from '../models/User.js';
import Product from '../models/Product.js';

export const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('cart.productId');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      cart: user.cart,
    });
  } catch (error) {
    console.error('Get Cart Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Check stock
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock',
      });
    }

    const user = await User.findById(req.user.id);

    // Check if product already in cart
    const cartItemIndex = user.cart.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (cartItemIndex > -1) {
      // Update quantity
      user.cart[cartItemIndex].quantity += quantity;
    } else {
      // Add new item
      user.cart.push({ productId, quantity });
    }

    await user.save();

    const updatedUser = await User.findById(req.user.id).populate(
      'cart.productId'
    );

    res.status(200).json({
      success: true,
      message: 'Item added to cart',
      cart: updatedUser.cart,
    });
  } catch (error) {
    console.error('Add to Cart Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Update cart item quantity
export const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1',
      });
    }

    const user = await User.findById(req.user.id);

    const cartItemIndex = user.cart.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (cartItemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not in cart',
      });
    }

    user.cart[cartItemIndex].quantity = quantity;
    await user.save();

    const updatedUser = await User.findById(req.user.id).populate(
      'cart.productId'
    );

    res.status(200).json({
      success: true,
      message: 'Cart updated',
      cart: updatedUser.cart,
    });
  } catch (error) {
    console.error('Update Cart Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user.id);

    user.cart = user.cart.filter(
      (item) => item.productId.toString() !== productId
    );

    await user.save();

    const updatedUser = await User.findById(req.user.id).populate(
      'cart.productId'
    );

    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      cart: updatedUser.cart,
    });
  } catch (error) {
    console.error('Remove from Cart Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Clear entire cart
export const clearCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.cart = [];
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Cart cleared',
      cart: [],
    });
  } catch (error) {
    console.error('Clear Cart Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};
