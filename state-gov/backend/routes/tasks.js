const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

// Get all tasks with optional status query
router.get("/", async (req, res) => {
  try {
    const { status } = req.query;
    let filter = {};
    if (status) filter.status = status;

    const tasks = await Task.find(filter).populate("ngoId", "name");
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
