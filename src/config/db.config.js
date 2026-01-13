import mongoose from 'mongoose';
import { env } from './env.config.js';

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${env.mongodbUri}`);
    console.log(`\n☘️  MongoDB connected! DB HOST: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error('MONGODB connection FAILED ', error);
    process.exit(1);
  }
};

export default connectDB;
