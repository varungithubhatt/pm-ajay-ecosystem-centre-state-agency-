import {Router } from "express"
import { createScheme,getAllSchemes,getSchemeById,updateScheme,deleteScheme } from "../controllers/scheme.controller.js";
import { verifyToken } from "../middleware/verifytoken.middleware.js";

const router=Router()

router.route("/create_schemes").post(verifyToken,createScheme);
router.route("/get_all_schemes").get(verifyToken,getAllSchemes);
router.route("/get_scheme/:id").get(verifyToken,getSchemeById);
router.route("/update_scheme/:id").put(verifyToken,updateScheme);
router.route("/delete_scheme/:id").delete(verifyToken,deleteScheme);

export default router;