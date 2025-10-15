import express from "express";
import Task from "../models/Task.js"; // Mongoose model for Tasks

const router = express.Router();

/**
 * @route   GET /api/tasks
 * @desc    Get tasks by email OR by villageID (query params)
 * @query   email or villageID
 * @access  Public
 */
router.get("/", async (req, res) => {
  try {
    const { email, villageID } = req.query;

    if (!email && !villageID) {
      return res
        .status(400)
        .json({ message: "Please provide either email or villageID" });
    }

    let query = {};
    if (email) query.email = email;
    if (villageID) query["village.villageID"] = parseInt(villageID);

    const tasks = await Task.find(query).sort({
      "village.development_task.deadline": 1,
    });

    if (!tasks || tasks.length === 0) {
      return res.status(404).json({ message: "No tasks found" });
    }

    res.status(200).json(tasks);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/all", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ "village.development_task.deadline": 1 });
    if (!tasks || tasks.length === 0) {
      return res.status(404).json({ message: "No tasks found" });
    }
    res.status(200).json(tasks);
  } catch (err) {
    console.error("Error fetching all tasks:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   GET /api/tasks/village/:villageID
 * @desc    Get tasks for a specific villageID (path param)
 * @access  Public
 */
router.get("/:villageID", async (req, res) => {
  try {
    const { villageID } = req.params;
    if (!villageID) {
      return res.status(400).json({ message: "villageID is required" });
    }

    const tasks = await Task.find({ "village.villageID": parseInt(villageID) });
    if (!tasks || tasks.length === 0) {
      return res.status(404).json({ message: "No tasks found for this village" });
    }

    res.status(200).json(tasks);
  } catch (err) {
    console.error("Error fetching tasks by villageID:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   POST /api/tasks/add
 * @desc    Add a new task
 * @access  Public
 */
router.post("/add", async (req, res) => {
  try {
    const { email, village } = req.body;

    if (!email || !village || !village.villageID || !village.development_task) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newTask = new Task({ email, village });
    const savedTask = await newTask.save();

    res.status(201).json(savedTask);
  } catch (err) {
    console.error("Error creating task:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
