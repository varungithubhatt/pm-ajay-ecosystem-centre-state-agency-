import express from "express";
import { getAllVillages,getVillageById,allocateFund,getFundAllocationsVillages, addDummyVillages, addVillage } from "../controllers/village.controlller.js";


const router = express.Router();

// Get all villages
router.get("/get-all-villages", getAllVillages);
router.get("/get-village/:id", getVillageById);

// Allocate fund
router.post("/allocate-fund/:id", allocateFund);

// Get fund allocations for a village
router.get("/get-fund-allocations-villages", getFundAllocationsVillages);




// Add dummy villages
router.post("/add-dummy-villages", addDummyVillages);
router.post("/add-village", addVillage);

export default router;
