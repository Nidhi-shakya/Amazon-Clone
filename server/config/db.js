import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod = null;

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/shopzone';
    
    // Try connecting to primary URI with short timeout
    try {
      const conn = await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 2500,
      });
      console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
      return conn;
    } catch (primaryErr) {
      console.warn(`[MongoDB] Primary connection failed (${primaryErr.message}). Starting in-memory MongoDB fallback...`);
      
      mongod = await MongoMemoryServer.create();
      const inMemoryUri = mongod.getUri();
      const conn = await mongoose.connect(inMemoryUri);
      console.log(`[MongoDB] Connected to in-memory database at: ${inMemoryUri}`);
      
      // Auto-seed in-memory database if empty
      const { seedDemoDataIfEmpty } = await import('../seeds/seeder.js');
      await seedDemoDataIfEmpty();
      
      return conn;
    }
  } catch (error) {
    console.error(`[MongoDB] Fatal error during database connection: ${error.message}`);
    process.exit(1);
  }
};

export const closeDB = async () => {
  try {
    await mongoose.connection.close();
    if (mongod) {
      await mongod.stop();
    }
  } catch (err) {
    console.error(`[MongoDB] Error closing database: ${err.message}`);
  }
};

