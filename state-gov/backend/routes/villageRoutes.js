const { Router } = require("express");
//const  getFundAllocationsVillages  = require("../controllers/villageController.js");
const { getVillagesByState, getVillageById } = require("../controllers/villageController.js");
const  router=Router();

router.get("/:state", getVillagesByState);

router.get("/villageID/:villageID", getVillageById);



module.exports = router; 