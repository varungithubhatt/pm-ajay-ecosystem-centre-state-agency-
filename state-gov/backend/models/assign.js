const mongoose = require("mongoose");

const assignSchema = new mongoose.Schema({
  ngoId: { type: mongoose.Schema.Types.ObjectId, ref: "Ngo", required: true },
  title: { type: String, required: true },
  fundAllocated: { type: Number, required: true },
  assignedDate: { type: Date, default: Date.now },
  startDate: { type: Date, required: true },
  deadline: { type: Date, required: true },
  status: { type: String, enum: ["Pending", "In Progress", "Completed"], default: "Pending" }
});

module.exports = mongoose.model("assign", assignSchema);
