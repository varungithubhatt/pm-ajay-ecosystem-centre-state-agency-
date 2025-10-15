import { Router } from "express";
import { getVillageFund, allocateVillageFund, getAllVillageFunds,updateVillageFund } from "../controllers/village-funds.js";

const router = Router();

router.get("/village-funds", getAllVillageFunds);
router.get("/village-funds/:villageID", getVillageFund);
router.put("/village-funds/:villageID", updateVillageFund);
router.post("/village-funds", allocateVillageFund);

export default router;
