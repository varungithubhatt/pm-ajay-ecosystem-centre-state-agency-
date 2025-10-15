import {Router} from "express"
import { verifyToken } from "../middleware/verifytoken.middleware.js";
import { generateReport, upload} from "../controllers/report.controller.js";


const router=Router()

router.post("/report/generate", verifyToken, upload.none(), generateReport);

export default router;