const mongoose = require("mongoose");
const villageSchema = require("../models/village");

// ✅ Use existing connection for villages (MONGO_URI2)
const villageConnection = mongoose.createConnection(process.env.MONGO_URI2, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// ✅ Prevent "Cannot overwrite model" errors
const Village =
  villageConnection.models.Village ||
  villageConnection.model("Village", villageSchema);

/**
 * @route   GET /api/villages/state/:state
 * @desc    Fetch all villages filtered by state
 * @access  Public (or Protected depending on your setup)
 */
const getVillagesByState = async (req, res) => {
  try {
    const { state } = req.params;

    if (!state) {
      return res.status(400).json({ message: "State parameter is required" });
    }

    // ✅ Case-insensitive search for better UX
    const villages = await Village.find({
      state: { $regex: new RegExp(`^${state}$`, "i") },
    });

    if (!villages.length) {
      return res
        .status(404)
        .json({ message: `No villages found for state "${state}"` });
    }

    return res.status(200).json({ count: villages.length, data: villages });
  } catch (err) {
    console.error("Error fetching villages by state:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * @route   GET /api/villages/:villageID
 * @desc    Fetch a single village by villageID
 * @access  Public (or Protected depending on your setup)
 */
const getVillageById = async (req, res) => {
  try {
    const { villageID } = req.params;

    if (!villageID) {
      return res.status(400).json({ message: "villageID parameter is required" });
    }

    const village = await Village.findOne({ villageID: villageID });

    if (!village) {
      return res
        .status(404)
        .json({ message: `No village found with ID "${villageID}"` });
    }

    return res.status(200).json({ data: village });
  } catch (err) {
    console.error("Error fetching village by ID:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ Export both functions
module.exports = {getVillagesByState ,
 getVillageById
}
