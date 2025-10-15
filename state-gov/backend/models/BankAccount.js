// models/BankAccount.js
const mongoose = require("mongoose");
const BankAccountSchema = new mongoose.Schema({
  stateGovId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  accountNumber: { type: String, required: true },
  ifsc: { type: String, required: true },
  bankName: { type: String, required: true },
  holderName: { type: String, required: true },
  balance: { type: Number, default: 0 }
});
module.exports = mongoose.model("BankAccount", BankAccountSchema);
