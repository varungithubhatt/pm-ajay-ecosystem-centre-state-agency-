// models/Transaction.js
const mongoose = require("mongoose");
const TransactionSchema = new mongoose.Schema({
  bankAccountId: { type: mongoose.Schema.Types.ObjectId, ref: "BankAccount" },
  type: { type: String, enum: ["add", "remove"], required: true },
  amount: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
  note: String
});
module.exports = mongoose.model("Transaction", TransactionSchema);
