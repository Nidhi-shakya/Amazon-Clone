import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// Helper to compute subtotal and free shipping status
const formatCartResponse = (cart) => {
  let subtotal = 0;
  let totalItems = 0;

  const items = cart.items
    .filter((item) => item.product !== null)
    .map((item) => {
      const itemSubtotal = item.price * item.quantity;
      subtotal += itemSubtotal;
      totalItems += item.quantity;
      return item;
    });

  // Business logic: Free delivery on orders over ₹499
  const freeDeliveryThreshold = 499;
  const isEligibleForFreeDelivery = subtotal >= freeDeliveryThreshold;
  const deliveryCharge = subtotal === 0 || isEligibleForFreeDelivery ? 0 : 40;
  const total = subtotal + deliveryCharge;

  return {
    _id: cart._id,
    user: cart.user,
    items,
    totalItems,
    subtotal: Math.round(subtotal),
    deliveryCharge,
    freeDeliveryThreshold,
    isEligibleForFreeDelivery,
    amountNeededForFreeDelivery: Math.max(0, freeDeliveryThreshold - subtotal),
    total: Math.round(total),
    updatedAt: cart.updatedAt,
  };
};

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate(
      'items.product',
      'name price mrp discountPercentage images countInStock isPrime brand'
    );

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    res.json({
      success: true,
      data: formatCartResponse(cart),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/items
// @access  Private
export const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required',
      });
    }

    const qty = Math.max(1, parseInt(quantity, 10));

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    if (product.countInStock < qty) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.countInStock} items available in stock`,
      });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      // Check total combined stock
      const newQty = cart.items[itemIndex].quantity + qty;
      if (newQty > product.countInStock) {
        return res.status(400).json({
          success: false,
          message: `Cannot add more. You have ${cart.items[itemIndex].quantity} in cart and only ${product.countInStock} are available`,
        });
      }
      cart.items[itemIndex].quantity = newQty;
      cart.items[itemIndex].price = product.price; // Keep verified server price
    } else {
      cart.items.push({
        product: product._id,
        quantity: qty,
        price: product.price,
      });
    }

    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate(
      'items.product',
      'name price mrp discountPercentage images countInStock isPrime brand'
    );

    res.status(200).json({
      success: true,
      message: 'Item added to cart',
      data: formatCartResponse(populatedCart),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update item quantity in cart
// @route   PATCH /api/cart/items/:productId
// @access  Private
export const updateCartItem = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty < 1) {
      return res.status(400).json({
        success: false,
        message: 'Valid quantity greater than 0 is required',
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    if (qty > product.countInStock) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.countInStock} units available in stock`,
      });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart',
      });
    }

    cart.items[itemIndex].quantity = qty;
    cart.items[itemIndex].price = product.price;
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate(
      'items.product',
      'name price mrp discountPercentage images countInStock isPrime brand'
    );

    res.json({
      success: true,
      message: 'Cart updated',
      data: formatCartResponse(populatedCart),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/items/:productId
// @access  Private
export const removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate(
      'items.product',
      'name price mrp discountPercentage images countInStock isPrime brand'
    );

    res.json({
      success: true,
      message: 'Item removed from cart',
      data: formatCartResponse(populatedCart),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear all items from cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }

    res.json({
      success: true,
      message: 'Cart cleared successfully',
      data: {
        items: [],
        totalItems: 0,
        subtotal: 0,
        deliveryCharge: 0,
        total: 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

