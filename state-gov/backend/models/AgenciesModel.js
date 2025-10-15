const mongoose = require("mongoose");

const agencySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    contact: { type: String, required: true },
    agencyType: { type: String, required: true },
    state: { type: String, required: true },
    district: { type: String, required: true },
    bankAcc: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

// ✅ Export schema only, NOT the model
module.exports = agencySchema;
