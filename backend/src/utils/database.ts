import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

export const connectDB = async (): Promise<void> => {
  let mongoUri: string;
  let mongoServer: MongoMemoryServer | undefined;

  // Check if we should use in-memory MongoDB for development
  if (process.env.USE_FAKE_STORE === 'true') {
    // Start in-memory MongoDB server only when explicitly using fake store
    mongoServer = await MongoMemoryServer.create();
    mongoUri = mongoServer.getUri();
    console.log('Starting in-memory MongoDB server');
  } else {
    // Use real MongoDB database (MongoDB Atlas or local)
    mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/vibe-commerce';
    console.log('Using real MongoDB database');
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    // Cleanup in-memory server if it was started
    if (mongoServer) {
      await mongoServer.stop();
    }
    process.exit(1);
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error);
  }
};
