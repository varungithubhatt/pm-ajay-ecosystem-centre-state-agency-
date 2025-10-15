const mongoose = require("mongoose");
const agencySchema = require("../models/AgenciesModel");

// ✅ Use existing connection
const agencyConnection = mongoose.createConnection(process.env.MONGO_URI2, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// ✅ Prevent "Cannot overwrite model" errors
const Agency =
  agencyConnection.models.Agency ||
  agencyConnection.model("Agency", agencySchema, "agencies");

/**
 * @route   GET /api/agencies/:state
 * @desc    Fetch all agencies filtered by state
 * @access  Public (or Protected depending on your setup)
 */
const getAgenciesByState = async (req, res) => {
  try {
    const { state } = req.params;

    if (!state) {
      return res.status(400).json({ message: "State parameter is required" });
    }

    // Case-insensitive search for better UX
    const agencies = await Agency.find({
      state: { $regex: new RegExp(`^${state}$`, "i") },
    });

    if (!agencies.length) {
      return res.status(404).json({ message: `No agencies found for state "${state}"` });
    }

    return res.status(200).json({ count: agencies.length, data: agencies });
  } catch (err) {
    console.error("Error fetching agencies by state:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { getAgenciesByState };
