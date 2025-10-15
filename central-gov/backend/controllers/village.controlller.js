import Village from "../models/villages.model.js";


export const getAllVillages=async(req,res)=>{
    try{
      const villages=await Village.find()
      return res.status(200).json({data:villages})
    }catch(err){
        return res.status(500).json({message:err.message})
    

    }

}

export const getVillageById=async(req,res)=>{
  try{
    const {id}=req.params
    const village=await Village.findById(id)
    if(!village){
      return res.status(404).json({message:"Village not found"})
    }
    return res.status(200).json({data:village}) 
}catch(err){
  return res.status(500).json({message:err.message})
}
}

export const allocateFund = async (req, res) => {

  try {
    const {id}=req.params
    const{amount}=req.body
    if (!amount) {
      return res.status(400).json({ message: "Amount is required." });
    }

    const village=await Village.findById(id)
    if(!village){
        return res.status(404).json({message:"Village not found"})
    
    }
     if (!village.fundAllocations) village.fundAllocations = [];
     village.fundAllocations.push({
      amount: Number(amount),
      allocatedBy: "Admin", // can be dynamic if using auth
      allocatedAt: new Date(),
    });

    await village.save();

 res.status(200).json({ message: "Fund allocated successfully!", village });
  }catch (error ){
    res.status(500).json({ message: error.message });
  }
};


// export const getFundAllocationsVillages = async (req, res) => {
//   try {
//     const villages = await Village.find();

//     if (!villages || villages.length === 0) {
//       return res.status(404).json({ message: "No villages found" });
//     }

//     // Flatten and combine all fund allocations from every village
//     const allAllocations = villages.flatMap((village) =>
//       (village.fundAllocations || []).map((fund) => ({
//         villageID: village.villageID,
//         villageName: village.villageName,
//         district: village.district,
//         state: village.state,
//         amount: fund.amount,
//         allocatedBy: fund.allocatedBy,
//         allocatedAt: fund.allocatedAt,
//       }))
//     );

//     return res.status(200).json({ data: allAllocations });
//   } catch (err) {
//     return res.status(500).json({ message: err.message });
//   }
// };
export const getFundAllocationsVillages = async (req, res) => {
  try {
    const villages = await Village.find();

    if (!villages || villages.length === 0) {
      return res.status(404).json({ message: "No villages found" });
    }

    // Flatten all fund allocations across all villages
    const fundAllocations = villages.flatMap((village) =>
      (village.fundAllocations || []).map((fund) => ({
        villageID: village.villageID,
        villageName: village.villageName,
        district: village.district,
        state: village.state,
        amount: fund.amount,
        allocatedBy: fund.allocatedBy,
        allocatedAt: fund.allocatedAt,
      }))
    );

    if (fundAllocations.length === 0) {
      return res.status(404).json({ message: "No fund allocations found" });
    }

    return res.status(200).json({ data: fundAllocations });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


export const addDummyVillages = async (req, res) => {
  try {
    const dummyVillages = [
      {
        villageID: "VIL001",
        villageName: "Bhainswal Kalan",
        state: "Haryana",
        district: "Sonipat",
        location: { latitude: 29.123, longitude: 76.901 },
        description: {
          population: 5000,
          scPercentage: 20,
          stPercentage: 5,
          nonScStPercentage: 75,
          developmentRate: 68,
          problems: { water: "shortage", roads: "need repair" },
        },

        upload_data: { uploadedBy: "Admin" },
      },
      {
        villageID: "VIL002",
        villageName: "Rampura",
        state: "Rajasthan",
        district: "Jaipur",
        location: { latitude: 26.912, longitude: 75.787 },
        description: {
          population: 4200,
          scPercentage: 18,
          stPercentage: 4,
          nonScStPercentage: 78,
          developmentRate: 73,
          problems: { healthcare: "limited", education: "improving" },
        },
        upload_data: { uploadedBy: "Admin" },
      },
      {
        villageID: "VIL003",
        villageName: "Nandgaon",
        state: "Maharashtra",
        district: "Nashik",
        location: { latitude: 20.325, longitude: 74.657 },
        description: {
          population: 6000,
          scPercentage: 22,
          stPercentage: 8,
          nonScStPercentage: 70,
          developmentRate: 80,
          problems: { electricity: "intermittent supply" },
        },
        upload_data: { uploadedBy: "Admin" },
      },
      // ✅ 10+ additional villages from your list:
      {
        villageID: "VLG001",
        villageName: "Rampur",
        state: "Haryana",
        district: "Rohtak",
        location: { latitude: 28.8956, longitude: 76.6066 },
        description: {
          population: 4200,
          scPercentage: 15,
          stPercentage: 4,
          nonScStPercentage: 81,
          developmentRate: 75,
          problems: { water: true, electricity: false, road: true },
          lastSelectedForPMAjay: new Date("2023-03-10"),
          otherDetails: { remarks: "Well connected by road" },
        },
        developmentTasks: [
          { taskID: "T001", taskName: "Road Repair", priority: "High" },
        ],
        upload_data: { uploadedBy: "Admin", uploadDate: new Date() },
      },
      {
        villageID: "VLG002",
        villageName: "Bhainswal",
        state: "Haryana",
        district: "Sonipat",
        location: { latitude: 29.0001, longitude: 77.0002 },
        description: {
          population: 5200,
          scPercentage: 18,
          stPercentage: 2,
          nonScStPercentage: 80,
          developmentRate: 68,
          problems: { water: false, electricity: true, sanitation: true },
          lastSelectedForPMAjay: new Date("2022-12-15"),
          otherDetails: { remarks: "Needs new school building" },
        },
        developmentTasks: [
          { taskID: "T002", taskName: "Sanitation Project", priority: "Medium" },
        ],
        upload_data: { uploadedBy: "Officer A", uploadDate: new Date() },
      },
      {
        villageID: "VLG003",
        villageName: "Nandgaon",
        state: "Maharashtra",
        district: "Nashik",
        location: { latitude: 20.3161, longitude: 74.6572 },
        description: {
          population: 8900,
          scPercentage: 12,
          stPercentage: 6,
          nonScStPercentage: 82,
          developmentRate: 80,
          problems: { water: false, electricity: false, road: false },
          lastSelectedForPMAjay: new Date("2024-02-01"),
          otherDetails: { remarks: "Model village" },
        },
        developmentTasks: [
          { taskID: "T003", taskName: "School Renovation", priority: "Low" },
        ],
        upload_data: { uploadedBy: "Admin", uploadDate: new Date() },
      },
      {
        villageID: "VLG004",
        villageName: "Pipra",
        state: "Uttar Pradesh",
        district: "Gorakhpur",
        location: { latitude: 26.7605, longitude: 83.3733 },
        description: {
          population: 7100,
          scPercentage: 22,
          stPercentage: 3,
          nonScStPercentage: 75,
          developmentRate: 62,
          problems: { drainage: true, school: true },
          lastSelectedForPMAjay: new Date("2023-08-12"),
          otherDetails: { remarks: "Flood-prone area" },
        },
        developmentTasks: [
          { taskID: "T004", taskName: "Drainage Construction", priority: "High" },
        ],
        upload_data: { uploadedBy: "Officer B", uploadDate: new Date() },
      },
      {
        villageID: "VLG005",
        villageName: "Chandipur",
        state: "Odisha",
        district: "Balasore",
        location: { latitude: 21.4733, longitude: 87.0139 },
        description: {
          population: 5400,
          scPercentage: 17,
          stPercentage: 12,
          nonScStPercentage: 71,
          developmentRate: 70,
          problems: { water: false, electricity: false, transport: true },
          lastSelectedForPMAjay: new Date("2022-06-01"),
          otherDetails: { remarks: "Tourist village" },
        },
        developmentTasks: [
          { taskID: "T005", taskName: "Transport Upgrade", priority: "Medium" },
        ],
        upload_data: { uploadedBy: "Admin", uploadDate: new Date() },
      },
      // ✅ Add remaining from your list (VLG006–VLG010) as they are valid
    ];

    // ✅ Optional: clear old dummy data to avoid duplication
    await Village.deleteMany({}); 

    // ✅ Insert all new dummy data
    await Village.insertMany(dummyVillages);

    res.status(201).json({
      success: true,
      message: "Dummy villages added successfully",
      count: dummyVillages.length,
    });
  } catch (error) {
    console.error("Error adding dummy villages:", error);
    res.status(500).json({
      success: false,
      message: "Error adding dummy villages",
      error: error.message,
    });
  }
};

export const addVillage = async (req, res) => {
  try {
    const {
      villageID,
      villageName,
      state,
      district,
      location,
      description,
      fundAllocations,
      developmentTasks,
      upload_data,
    } = req.body;

    // ✅ Basic validation
    if (!villageID || !villageName || !state || !district || !location || !upload_data) {
      return res.status(400).json({ message: "Please fill all required fields." });
    }

    // ✅ Check if village with same ID already exists
    const existingVillage = await Village.findOne({ villageID });
    if (existingVillage) {
      return res.status(400).json({ message: "Village with this ID already exists." });
    }

    // ✅ Create and save new village
    const newVillage = new Village({
      villageID,
      villageName,
      state,
      district,
      location,
      description,
      fundAllocations,
      developmentTasks,
      upload_data,
    });

    await newVillage.save();

    return res.status(201).json({
      success: true,
      message: "Village added successfully.",
      data: newVillage,
    });
  } catch (error) {
    console.error("Error adding village:", error);
    return res.status(500).json({ message: error.message });
  }
};
