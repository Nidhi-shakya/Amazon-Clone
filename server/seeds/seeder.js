import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';
import Wishlist from '../models/Wishlist.js';
import Order from '../models/Order.js';
import { productsData } from './productsData.js';

dotenv.config();

export const demoUsers = [
  {
    name: 'Rahul Sharma',
    email: 'demo@shopzone.in',
    password: 'password123',
    role: 'customer',
    addresses: [
      {
        fullName: 'Rahul Sharma',
        phone: '9876543210',
        street: 'Flat 402, Green Glen Layout, Bellandur',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560103',
        country: 'India',
        isDefault: true,
      },
      {
        fullName: 'Rahul Sharma (Office)',
        phone: '9876543210',
        street: 'Tech Park, Tower B, Electronic City Phase 1',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560100',
        country: 'India',
        isDefault: false,
      },
    ],
  },
  {
    name: 'ShopZone Administrator',
    email: 'admin@shopzone.in',
    password: 'admin123password',
    role: 'admin',
    addresses: [
      {
        fullName: 'Admin Operations',
        phone: '9123456780',
        street: 'Plot 12, Cyber City',
        city: 'Gurugram',
        state: 'Haryana',
        postalCode: '122002',
        country: 'India',
        isDefault: true,
      },
    ],
  },
];

export const seedDatabase = async () => {
  try {
    console.log('[Seeder] Cleaning existing database records...');
    await User.deleteMany({});
    await Product.deleteMany({});
    await Cart.deleteMany({});
    await Wishlist.deleteMany({});
    await Order.deleteMany({});

    console.log('[Seeder] Seeding demo users...');
    const createdUsers = [];
    for (const u of demoUsers) {
      const user = await User.create(u);
      createdUsers.push(user);
      // Initialize cart and wishlist
      await Cart.create({ user: user._id, items: [] });
      await Wishlist.create({ user: user._id, products: [] });
    }

    console.log('[Seeder] Seeding product catalogue...');
    const createdProducts = await Product.insertMany(productsData);

    // Create a realistic sample past order for the demo customer user
    const demoCustomer = createdUsers[0];
    const sampleItems = [
      {
        product: createdProducts[0]._id,
        name: createdProducts[0].name,
        quantity: 1,
        image: createdProducts[0].images[0],
        price: createdProducts[0].price,
        mrp: createdProducts[0].mrp,
      },
      {
        product: createdProducts[15]._id, // Atomic Habits book
        name: createdProducts[15].name,
        quantity: 1,
        image: createdProducts[15].images[0],
        price: createdProducts[15].price,
        mrp: createdProducts[15].mrp,
      },
    ];

    const itemsTotal = sampleItems.reduce((acc, it) => acc + it.price * it.quantity, 0);

    const pastOrderDate = new Date();
    pastOrderDate.setDate(pastOrderDate.getDate() - 5);

    await Order.create({
      user: demoCustomer._id,
      orderNumber: 'SZ-2026-DEL7812',
      orderItems: sampleItems,
      shippingAddress: demoCustomer.addresses[0],
      paymentMethod: 'UPI',
      paymentResult: {
        id: 'PAY-SAMPLE-UPI-9921',
        status: 'COMPLETED',
        update_time: pastOrderDate.toISOString(),
        reference: 'TXN-RAHUL-UPI',
      },
      itemsPrice: itemsTotal,
      deliveryPrice: 0,
      taxPrice: 0,
      totalPrice: itemsTotal,
      isPaid: true,
      paidAt: pastOrderDate,
      isDelivered: true,
      deliveredAt: new Date(pastOrderDate.getTime() + 2 * 24 * 60 * 60 * 1000),
      status: 'Delivered',
      createdAt: pastOrderDate,
    });

    console.log(`[Seeder] Successfully seeded ${createdProducts.length} products and ${createdUsers.length} users!`);
  } catch (error) {
    console.error(`[Seeder] Error seeding database: ${error.message}`);
    throw error;
  }
};

export const seedDemoDataIfEmpty = async () => {
  try {
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log('[Seeder] Database is empty. Seeding initial demonstration data...');
      await seedDatabase();
    }
  } catch (err) {
    console.warn(`[Seeder] Auto-seed check warning: ${err.message}`);
  }
};

// If run directly from CLI
if (process.argv[1]?.endsWith('seeder.js')) {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/shopzone';
  mongoose
    .connect(mongoUri)
    .then(async () => {
      console.log(`[Seeder] Connected to MongoDB at ${mongoUri}`);
      await seedDatabase();
      console.log('[Seeder] Seed complete. Exiting...');
      process.exit(0);
    })
    .catch((err) => {
      console.error(`[Seeder] Connection failed: ${err.message}`);
      process.exit(1);
    });
}

