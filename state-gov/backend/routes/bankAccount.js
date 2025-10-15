const express = require("express");
const router = express.Router();
const BankAccount = require("../models/BankAccount");
const Transaction = require("../models/Transaction");

// Get bank account details for given stateGovId
router.get("/:stateGovId", async (req, res) => {
  try {
    const account = await BankAccount.findOne({ stateGovId: req.params.stateGovId });
    if (!account) return res.status(404).send("Bank account not found");
    res.json(account);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Add money to bank account
router.post("/:id/add-money", async (req, res) => {
  try {
    const { amount, note } = req.body;
    const account = await BankAccount.findById(req.params.id);
    if (!account) return res.status(404).send("Account not found");
    if (amount <= 0) return res.status(400).send("Amount must be positive");

    account.balance += amount;
    await account.save();

    await Transaction.create({ bankAccountId: account._id, type: "add", amount, note });

    res.json({ message: "Amount added successfully", balance: account.balance });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Remove money from bank account
router.post("/:id/remove-money", async (req, res) => {
  try {
    const { amount, note } = req.body;
    const account = await BankAccount.findById(req.params.id);
    if (!account) return res.status(404).send("Account not found");
    if (amount <= 0) return res.status(400).send("Amount must be positive");
    if (amount > account.balance) return res.status(400).send("Insufficient funds");

    account.balance -= amount;
    await account.save();

    await Transaction.create({ bankAccountId: account._id, type: "remove", amount, note });

    res.json({ message: "Amount removed successfully", balance: account.balance });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Get transaction history for bank account
router.get("/:id/transactions", async (req, res) => {
  try {
    const transactions = await Transaction.find({ bankAccountId: req.params.id }).sort({ timestamp: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

module.exports = router;
