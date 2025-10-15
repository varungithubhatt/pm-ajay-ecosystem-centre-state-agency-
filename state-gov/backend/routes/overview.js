const express = require("express");
const router = express.Router();
const Ngo = require("../models/AgenciesModel");
const Task = require("../models/Task");
// If you have a Fund/Transaction model, import it too

router.get("/", async (req, res) => {
  try {
    // Stats collection: adjust field names/models as per your app
    const [ngoCount, taskTotal, completedTasks] = await Promise.all([
      Ngo.countDocuments(),
      Task.countDocuments(),
      Task.countDocuments({ status: "Completed" }),
    ]);
    // Dummy funds or implement your real calculation:
    const totalFunds = 125000; // Replace with real sum if you have fund data

    res.json({
      ngoCount,
      taskTotal,
      completedTasks,
      totalFunds
    });
  } catch (err) {
    res.status(500).json({ message: "Overview fetch failed" });
  }
});

module.exports = router;
