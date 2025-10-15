const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  ngoId: { type: mongoose.Schema.Types.ObjectId, ref: "Ngo", required: true },
  title: { type: String, required: true },
  status: { type: String, enum: ["Pending", "In Progress", "Completed"], default: "Pending" },
  assignedDate: { type: Date, default: Date.now },
  completedDate: { type: Date }
});

module.exports = mongoose.model("Task", TaskSchema);
