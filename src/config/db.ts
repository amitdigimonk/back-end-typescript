import { env } from '../env';
import mongoose from 'mongoose';
import { errorColor, successColor } from '../utils/color';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGO_URI || 'mongodb://localhost:27017/mydatabase');
    console.log(successColor, `MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(errorColor, `Error: ${error instanceof Error ? error.message : error}`);
    process.exit(1);
  }
};