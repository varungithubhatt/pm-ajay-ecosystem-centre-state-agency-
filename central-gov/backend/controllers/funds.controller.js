import FundAllocation from '../models/funds.model.js';
import Scheme from '../models/scheme.model.js';



export const allocateFunds = async (req, res) => {
    try{
        const {schemeId,stateUT, village,allocatedAmount }=req.body;
     if (!schemeId || !stateUT || !allocatedAmount) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (req.user.role !== "CENTRE") {
      return res.status(403).json({ message: "Only CENTRE officials can allocate funds" });
    }

    const scheme = await Scheme.findById(schemeId);
    if (!scheme) {
      return res.status(404).json({ message: "Scheme not found" });
    }

    const newAllocation = new FundAllocation({
      scheme: schemeId,
      stateUT: stateUT,
      village:village,
        allocatedAmount,
     createdBy: req.user.userId,

    })
    await newAllocation.save();
    res.status(201).json({message:"Funds allocated successfully", data:newAllocation})

    }catch(error){
        res.status(500).json({message:error.message})
    }
}

export const getFundAllocations = async (req, res) => {
    try{
        const getallocations=await FundAllocation.find().populate('scheme',"name category").populate('createdBy','name email role');
        res.status(200).json({data:getallocations})

    }catch(error){
        res.status(500).json({message:error.message})
    }
}


export const updateFundUtilization = async (req, res) => {
    try{
       const { allocationId, utilizedAmount } = req.body;
       const allocation = await FundAllocation.findById(allocationId);
       if (!allocation) {
           return res.status(404).json({ message: "Allocation not found" });
       }
       allocation.releasedAmount += utilizedAmount;
       if (allocation.releasedAmount > allocation.allocatedAmount) {
           return res.status(400).json({ message: "Utilized amount exceeds allocated amount" });
       }
       await allocation.save();
       res.status(200).json({ message: "Fund utilization updated successfully", data: allocation });
    }catch(error){
        res.status(500).json({message:error.message})
    }
}


export const getStateWiseAllocations = async (req, res) => {
    try{
        const stateWise = await FundAllocation.aggregate([
            {
                $group: {
                    _id: "$stateUT",
                    totalAllocated: { $sum: "$allocatedAmount" },
                    totalReleased: { $sum: "$releasedAmount" }
                }
            }
        ]);
        res.status(200).json({ data: stateWise });

    }catch(error){
        res.status(500).json({message:error.message})
    }
}

export const getSchemeWiseAllocations = async (req, res) => {
    try{
        const schemeWise = await FundAllocation.aggregate([
            {
                $group: {
                    _id: "$scheme",
                    totalAllocated: { $sum: "$allocatedAmount" },
                    totalReleased: { $sum: "$releasedAmount" }
                }
            },
            {
                $lookup: {
                    from: "schemes",
                    localField: "_id",
                    foreignField: "_id",
                    as: "schemeDetails"
                }
            },
            {
                $unwind: "$schemeDetails"
            },      
            {
                $project: {
                    _id: 0,
                    schemeId: "$schemeDetails._id",
                    schemeName: "$schemeDetails.name",
                    totalAllocated: 1,
                    totalReleased: 1
                }
            }
        ]);
        res.status(200).json({ data: schemeWise });

    }catch(error){
        res.status(500).json({message:error.message})
    }

}

// Get all fund allocations for a specific village
export const getVillageAllocations = async (req, res) => {
  try {
    const { villageID } = req.params;
    if (!villageID) return res.status(400).json({ message: "Village ID is required" });

    const allocations = await FundAllocation.find({ village: villageID })
      .populate("scheme", "name category")
      .populate("createdBy", "name email role");

    if (!allocations.length) {
      return res.status(404).json({ message: "No allocations found for this village" });
    }

    res.status(200).json({ data: allocations });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
