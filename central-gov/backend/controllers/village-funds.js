import VillageFunds from "../models/village-funds.js";

// ✅ Get fund by villageID
export const getVillageFund = async (req, res) => {
  try {
    const { villageID } = req.params;
    const fund = await VillageFunds.findOne({ villageID });
    if (!fund)
      return res
        .status(404)
        .json({ message: "No funds allocated for this village" });
    res.status(200).json({ data: fund });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Allocate new fund for a village
export const allocateVillageFund = async (req, res) => {
  try {
    const { villageID, villageName, district, state, fundsAllocated } = req.body;

    // Validate required fields
    if (
      !villageID ||
      !villageName ||
      !district ||
      !state ||
      fundsAllocated == null
    ) {
      return res.status(400).json({
        message:
          "villageID, villageName, district, state, and fundsAllocated are required",
      });
    }

    // Check if fund already exists
    const existingFund = await VillageFunds.findOne({ villageID });

    if (existingFund) {
      // If already allocated, prevent re-allocation
      return res
        .status(400)
        .json({ message: "Funds have already been allocated for this village" });
    }

    // Create new fund entry
    const newFund = new VillageFunds({
      villageID,
      villageName,
      district,
      state,
      fundsAllocated,
    });
    await newFund.save();

    res.status(201).json({
      message: "Fund allocated successfully",
      data: newFund,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get all villages with fund allocations
export const getAllVillageFunds = async (req, res) => {
  try {
    const allFunds = await VillageFunds.find().sort({ createdAt: -1 }); // latest first
    res.status(200).json({ data: allFunds });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update funds for a specific village (PUT request)
export const updateVillageFund = async (req, res) => {
  try {
    const { villageID } = req.params;
    const { fundsAllocated } = req.body;

    if (!fundsAllocated && fundsAllocated !== 0) {
      return res
        .status(400)
        .json({ message: "fundsAllocated field is required" });
    }

    // Find village by ID
    const village = await VillageFunds.findOne({ villageID });
    if (!village)
      return res.status(404).json({ message: "Village not found" });

    // Update fund
    village.fundsAllocated = fundsAllocated;
    await village.save();

    res.status(200).json({
      message: "Village funds updated successfully",
      data: village,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
