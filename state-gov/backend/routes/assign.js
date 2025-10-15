const express = require("express");
const router = express.Router();

const Assign = require("../models/assign"); // Properly capitalized import

// POST - assign new task
router.post("/", async (req, res) => {
  try {
    const { ngoId, title, fundAllocated, assignedDate, startDate, deadline, status } = req.body;

    const newAssign = new Assign({
      ngoId,
      title,
      fundAllocated,
      assignedDate,
      startDate,
      deadline,
      status: status || "Pending",
    });

    const savedAssign = await newAssign.save();

    res.status(201).json(savedAssign); // Return saved assignment
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create task" });
  }
});

// GET - fetch tasks, optionally filtered by status, and populate ngoId with name
router.get("/", async (req, res) => {
  try {
    const { status } = req.query;
    let filter = {};
    if (status) filter.status = status;

    const tasks = await Assign.find(filter).populate("ngoId", "name");
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
