const express = require("express");
const router = express.Router();
const { getVillageByID } = require("../controllers/villagefunds");

// GET /api/village/:villageID
router.get("/:villageID", getVillageByID);

module.exports = router;
