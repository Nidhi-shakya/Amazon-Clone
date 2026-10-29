import Wishlist from '../models/Wishlist.js';
import Product from '../models/Product.js';

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
export const getWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate(
      'products',
      'name price mrp discountPercentage images countInStock rating numReviews isPrime brand category'
    );

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }

    res.json({
      success: true,
      count: wishlist.products.length,
      data: wishlist.products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle item in wishlist (add if not present, remove if present)
// @route   POST /api/wishlist/toggle
// @access  Private
export const toggleWishlistItem = async (req, res, next) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required',
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }

    const existsIndex = wishlist.products.findIndex(
      (id) => id.toString() === productId
    );

    let isAdded = false;

    if (existsIndex > -1) {
      wishlist.products.splice(existsIndex, 1);
      isAdded = false;
    } else {
      wishlist.products.push(productId);
      isAdded = true;
    }

    await wishlist.save();

    const populatedWishlist = await Wishlist.findById(wishlist._id).populate(
      'products',
      'name price mrp discountPercentage images countInStock rating numReviews isPrime brand category'
    );

    res.json({
      success: true,
      message: isAdded ? 'Added to Wishlist' : 'Removed from Wishlist',
      isWishlisted: isAdded,
      count: populatedWishlist.products.length,
      data: populatedWishlist.products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from wishlist
// @route   DELETE /api/wishlist/items/:productId
// @access  Private
export const removeFromWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;

    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found',
      });
    }

    wishlist.products = wishlist.products.filter(
      (id) => id.toString() !== productId
    );

    await wishlist.save();

    const populatedWishlist = await Wishlist.findById(wishlist._id).populate(
      'products',
      'name price mrp discountPercentage images countInStock rating numReviews isPrime brand category'
    );

    res.json({
      success: true,
      message: 'Item removed from wishlist',
      count: populatedWishlist.products.length,
      data: populatedWishlist.products,
    });
  } catch (error) {
    next(error);
  }
};

