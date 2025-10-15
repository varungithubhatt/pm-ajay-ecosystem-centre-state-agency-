// routes/villageFunds.js
import express from "express";
import VillageFunds from "../models/Villagefunds.js"; // import your schema

const router = express.Router();

// GET funds for a specific village by villageID
// Example: GET /api/village-funds?villageID=1
router.get("/", async (req, res) => {
  const { villageID } = req.query;

  if (!villageID) {
    return res.status(400).json({ message: "villageID is required" });
  }

  try {
    const fundData = await VillageFunds.findOne({ villageID: Number(villageID) });

    if (!fundData) {
      return res.status(404).json({ message: "No funds found for this village" });
    }

    res.json(fundData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

export default router;
