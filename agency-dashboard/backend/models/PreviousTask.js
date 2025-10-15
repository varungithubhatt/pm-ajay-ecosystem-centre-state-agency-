import mongoose from "mongoose";

const previousTaskSchema = new mongoose.Schema({
  villageID: { type: String, required: true },
  villageName: { type: String, required: true },
  district: { type: String, required: true },
  state: { type: String, required: true },
  userEmail: { type: String, required: true },
  userName: { type: String, required: true },
  contactInfo: { type: String, required: true },
  totalFundsAllocated: { type: Number, default: 0 },
  reports: [
    {
      title: String,
      description: String,
      photos: [String],
      videos: [String],
      aiChecked: Boolean,
      submitted: Boolean,
      fundsSpent: Number,
      assignedON: Date,
      completedON: Date,
    },
  ],
  assignedON: { type: Date, default: Date.now },
  completedON: { type: Date },
});

export default mongoose.model("PreviousTask", previousTaskSchema, "previous-task");
