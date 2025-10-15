import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path"; // <-- Add this
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import fundsRoutes from "./routes/villagefunds.js";
import checkAiRoutes from "./routes/checkAiRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";
import PreviousTask from "./routes/previoustask.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploads folder as static
app.use("/uploads", express.static(path.join(process.cwd(), "uploads"))); // <-- Add this

// Safe check to help debugging: show whether MONGO_URI is loaded (print length only)
if (process.env.MONGO_URI) {
  console.log(`ℹ️ MONGO_URI loaded (length=${process.env.MONGO_URI.length})`);
} else {
  console.log("⚠️ MONGO_URI not found in environment (backend/.env may be missing)");
}

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/village-funds", fundsRoutes);
app.use("/api/check-ai", checkAiRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/previous-tasks", PreviousTask);

// Root route (optional)
app.get("/", (req, res) => {
  res.send("🚀 Server is running");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
