const express = require("express");
const router = express.Router();
const { getAgenciesByState } = require("../controllers/agenciesController");

// GET agencies by state
router.get("/:state", getAgenciesByState);

module.exports = router;
