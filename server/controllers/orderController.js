import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';

// Helper to generate professional order numbers (e.g., SZ-2026-87421)
const generateOrderNumber = () => {
  const timestamp = Date.now().toString().slice(-4);
  const random = Math.floor(1000 + Math.random() * 9000);
  return `SZ-2026-${timestamp}${random}`;
};

// @desc    Create a new order with server-side price & stock verification
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res, next) => {
  try {
    const { orderItems, shippingAddress, paymentMethod } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No items in order',
      });
    }

    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city || !shippingAddress.postalCode) {
      return res.status(400).json({
        success: false,
        message: 'Please provide complete shipping address details',
      });
    }

    // Server-side validation of products, current prices, and stock
    const verifiedOrderItems = [];
    let itemsPrice = 0;

    for (const item of orderItems) {
      const productId = item.product || item._id;
      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product with ID ${productId} not found`,
        });
      }

      const qty = parseInt(item.quantity, 10);
      if (qty <= 0) {
        return res.status(400).json({
          success: false,
          message: `Invalid quantity for product ${product.name}`,
        });
      }

      if (product.countInStock < qty) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${product.name}". Only ${product.countInStock} available.`,
        });
      }

      // Deduct inventory stock
      product.countInStock -= qty;
      await product.save();

      // Snapshot product details and server-verified price
      verifiedOrderItems.push({
        product: product._id,
        name: product.name,
        image: product.images[0] || '',
        price: product.price,
        mrp: product.mrp,
        quantity: qty,
      });

      itemsPrice += product.price * qty;
    }

    // Business pricing logic:
    // Delivery is ₹0 if itemsPrice >= 499, else ₹40 standard delivery
    const deliveryPrice = itemsPrice >= 499 ? 0 : 40;
    const taxPrice = 0; // Prices are all-inclusive (MRP / GST included)
    const totalPrice = Math.round(itemsPrice + deliveryPrice + taxPrice);

    // Calculate realistic estimated delivery (current date + 2-3 business days)
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 3);

    const order = new Order({
      user: req.user._id,
      orderNumber: generateOrderNumber(),
      orderItems: verifiedOrderItems,
      shippingAddress: {
        fullName: shippingAddress.fullName || req.user.name,
        phone: shippingAddress.phone || '9876543210',
        street: shippingAddress.street,
        city: shippingAddress.city,
        state: shippingAddress.state,
        postalCode: shippingAddress.postalCode,
        country: shippingAddress.country || 'India',
      },
      paymentMethod: paymentMethod || 'COD',
      paymentResult: {
        id: `PAY-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        status: paymentMethod === 'COD' ? 'PENDING' : 'COMPLETED',
        update_time: new Date().toISOString(),
        reference: `TXN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      },
      itemsPrice,
      deliveryPrice,
      taxPrice,
      totalPrice,
      isPaid: paymentMethod !== 'COD',
      paidAt: paymentMethod !== 'COD' ? new Date() : null,
      isDelivered: false,
      estimatedDelivery,
      status: 'Confirmed',
    });

    const createdOrder = await order.save();

    // Clear user's active cart upon order placement
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { $set: { items: [] } }
    );

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: createdOrder,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user's order history
// @route   GET /api/orders/my-orders
// @access  Private
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('orderItems.product', 'name category brand');

    res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      'user',
      'name email'
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Ensure order belongs to logged in user or admin
    if (
      order.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order',
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

