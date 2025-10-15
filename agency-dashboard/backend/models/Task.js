// backend/models/Task.js
import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  email: { type: String, required: true }, // User email

  village: {
    villageID : { type: Number, required: true },
    name: { type: String, required: true },
    state: { type: String, required: true },
    district: { type: String, required: true },
    location: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    population: {
      total: { type: Number, required: true },
      sc_st_percentage: { type: Number, required: true },
      non_sc_st_percentage: { type: Number, required: true },
    },
    development_task: {
      task_name: { type: String, required: true },
      description: { type: String, required: true },
      assigned_to: { type: String, required: true },
      assigned_on: { type: Date, required: true },
      deadline: { type: Date, required: true },
      status: { type: String, default: "Pending" },
    },
  },

  createdAt: { type: Date, default: Date.now },
});

// Export Mongoose model
export default mongoose.model("Task", taskSchema, "Tasks-assigned");
