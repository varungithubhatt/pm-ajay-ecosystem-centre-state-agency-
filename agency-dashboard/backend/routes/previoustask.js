import express from "express";
import PreviousTask from "../models/PreviousTask.js";

const router = express.Router();

// GET previous tasks by user email
router.get("/user/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const tasks = await PreviousTask.find({ userEmail: email });

    if (!tasks || tasks.length === 0)
      return res.status(404).json({ message: "No previous tasks found for this user." });

    res.status(200).json({ message: "Previous tasks fetched successfully.", data: tasks });
  } catch (error) {
    console.error("Error fetching previous tasks:", error);
    res.status(500).json({ message: "Server error", error: error.toString() });
  }
});

// Fetch previous tasks by village ID
router.get("/village/:villageID", async (req, res) => {
  try {
    const { villageID } = req.params;
    const tasks = await PreviousTask.find({ villageID });

    if (!tasks || tasks.length === 0) {
      return res.status(404).json({ message: "No previous tasks found for this village." });
    }

    res.status(200).json({ message: "Previous tasks fetched successfully.", data: tasks });
  } catch (error) {
    console.error("Error fetching previous tasks by village:", error);
    res.status(500).json({ message: "Server error", error: error.toString() });
  }
});

// GET all previous tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await PreviousTask.find(); // fetch all documents

    if (!tasks || tasks.length === 0) {
      return res.status(404).json({ message: "No previous tasks found." });
    }

    res.status(200).json({ message: "All previous tasks fetched successfully.", data: tasks });
  } catch (error) {
    console.error("Error fetching all previous tasks:", error);
    res.status(500).json({ message: "Server error", error: error.toString() });
  }
});



export default router;
