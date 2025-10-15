import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

// Try default dotenv load first (works when process.cwd() is the backend folder).
dotenv.config();

// If MONGO_URI wasn't loaded (e.g. server started from repo root), try backend/.env.
if (!process.env.MONGO_URI) {
  const fallback = path.resolve(process.cwd(), "backend", ".env");
  dotenv.config({ path: fallback });
}

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri || typeof mongoUri !== "string") {
      throw new Error(
        "MONGO_URI is not defined or not a string. Check backend/.env or your environment variables."
      );
    }

    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ DB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
