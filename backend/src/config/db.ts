import mongoose from "mongoose";
import config from "./config.js";
import logger from "./logger.js";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.MONGO_URI || "mongodb://localhost:27017/e8_laundromat");
    logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    logger.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
