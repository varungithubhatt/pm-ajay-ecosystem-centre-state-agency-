const VillageFunds = require("../models/villagefunds");

// Get village by villageID
const getVillageByID = async (req, res) => {
  const { villageID } = req.params;

  try {
    const village = await VillageFunds.findOne({ villageID: Number(villageID) });

    if (!village) {
      return res.status(404).json({ message: "Village not found" });
    }

    return res.status(200).json({ data: village });
  } catch (error) {
    console.error("Error fetching village:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getVillageByID };
