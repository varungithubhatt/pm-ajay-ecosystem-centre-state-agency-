import express from "express";
import bcrypt from "bcryptjs";
import Agency from "../models/Agency.js";

const router = express.Router();

// SIGNUP
router.post("/signup", async (req, res) => {
  try {
    const { name, email, contact, agencyType, state, district, bankAcc, password } = req.body;

    const existing = await Agency.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAgency = new Agency({
      name,
      email,
      contact,
      agencyType,
      state,
      district,
      bankAcc,
      password: hashedPassword,
    });

    await newAgency.save();

    res.status(201).json({ message: "Signup successful" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const agency = await Agency.findOne({ email });
    if (!agency) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, agency.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    res.status(200).json({ message: "Login successful", user: agency });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET USER BY EMAIL
router.get("/user/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const agency = await Agency.findOne({ email });

    if (!agency) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(agency);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
