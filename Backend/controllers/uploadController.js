import { deleteImageFromCloudinary } from '../utils/cloudinaryHelper.js';
import Product from '../models/Product.js';

/**
 * Upload product image to Cloudinary
 * Endpoint: POST /api/admin/upload-image
 */
export const uploadProductImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided',
      });
    }

    // Cloudinary storage automatically handles the upload
    const imageUrl = req.file.path;

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      imageUrl,
      fileName: req.file.filename,
    });
  } catch (error) {
    console.error('Upload Image Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading image',
      error: error.message,
    });
  }
};

/**
 * Update product with new image
 * Endpoint: PUT /api/admin/products/:id/upload-image
 */
export const updateProductImage = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided',
      });
    }

    // Find product
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Delete old image from Cloudinary if it exists and is a Cloudinary URL
    if (product.image && product.image.includes('cloudinary')) {
      await deleteImageFromCloudinary(product.image);
    }

    // Update with new image URL
    const newImageUrl = req.file.path;
    product.image = newImageUrl;
    await product.save();

    res.status(200).json({
      success: true,
      message: 'Product image updated successfully',
      product,
      imageUrl: newImageUrl,
    });
  } catch (error) {
    console.error('Update Product Image Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating product image',
      error: error.message,
    });
  }
};

/**
 * Delete product image
 * Endpoint: DELETE /api/admin/products/:id/image
 */
export const deleteProductImage = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Delete image from Cloudinary
    if (product.image && product.image.includes('cloudinary')) {
      await deleteImageFromCloudinary(product.image);
    }

    // Reset to default image
    product.image = 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400';
    await product.save();

    res.status(200).json({
      success: true,
      message: 'Product image deleted successfully',
      product,
    });
  } catch (error) {
    console.error('Delete Product Image Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting product image',
      error: error.message,
    });
  }
};
