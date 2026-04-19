import mongoose from "mongoose";
import { envList } from "../../envConfig.js";

const connectDB = async () => {
  try {
    await mongoose.connect(envList.DB_STRING);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export default connectDB;