const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  photos: [String],
  videos: [String],
  aiChecked: { type: Boolean, default: false },
  submitted: { type: Boolean, default: false },
  fundsSpent: { type: Number } // new field for additional input (for reports except current condition)
});

const progressReportSchema = new mongoose.Schema(
  {
    villageID: { type: String, required: true },
    villageName: { type: String, required: true },
    district: { type: String, required: true },
    state: { type: String, required: true },
    userEmail: { type: String, required: true },
    userName: { type: String, required: true },
    contactInfo: { type: String, required: true },
    totalFundsAllocated: { type: Number, default: 0 }, // new field to store total funds for the village
    reports: [reportSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProgressReport", progressReportSchema, "Progress-Reports");
