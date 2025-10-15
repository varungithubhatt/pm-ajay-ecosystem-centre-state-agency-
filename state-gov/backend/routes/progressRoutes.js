const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const ProgressReport = require("../models/ProgressReport.js");

const router = express.Router();

// Create directories if not exist
const uploadDir = "uploads";
const photoDir = path.join(uploadDir, "photos");
const videoDir = path.join(uploadDir, "videos");
[uploadDir, photoDir, videoDir].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, photoDir);
    else cb(null, videoDir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// ------------------------------------------------------------
// CREATE or UPDATE report
// ------------------------------------------------------------
router.get("/state/:stateName", async (req, res) => {
  try {
    const { stateName } = req.params;
    if (!stateName) {
      return res.status(400).json({ message: "State name is required" });
    }

    const reports = await ProgressReport.find({ state: stateName });

    if (!reports || reports.length === 0) {
      return res
        .status(404)
        .json({ message: `No reports found for state: ${stateName}` });
    }

    res.status(200).json({
      message: `Reports for state ${stateName} fetched successfully`,
      count: reports.length,
      data: reports,
    });
  } catch (error) {
    console.error("Error fetching reports by state:", error);
    res.status(500).json({ message: "Server error", error: error.toString() });
  }
});

router.post(
  "/submit/:villageID/:reportIndex",
  upload.fields([
    { name: "photos", maxCount: 10 },
    { name: "videos", maxCount: 5 },
  ]),
  async (req, res) => {
    try {
      const { villageID, reportIndex } = req.params;
      const {
        userEmail,
        userName,
        contactInfo,
        description,
        title,
        villageName,
        district,
        state,
        extraInput,
        totalFundsAllocated,
      } = req.body;

      const index = parseInt(reportIndex);

      if (
        !userEmail ||
        !userName ||
        !contactInfo ||
        !description ||
        !title ||
        !villageName ||
        !district ||
        !state
      ) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const photoPaths = (req.files["photos"] || []).map(
        (f) => `/uploads/photos/${f.filename}`
      );
      const videoPaths = (req.files["videos"] || []).map(
        (f) => `/uploads/videos/${f.filename}`
      );

      // Find existing progress doc
      let progress = await ProgressReport.findOne({ villageID, userEmail });

      // Create new document if not found
      if (!progress) {
        const newReports = Array(5)
          .fill(null)
          .map((_, i) => ({
            title: `Report ${i + 1}`,
            description: "",
            photos: [],
            videos: [],
            submitted: false,
            aiChecked: false,
            fundsSpent: i !== 0 ? 0 : undefined,
          }));

        newReports[index] = {
          title,
          description,
          photos: photoPaths,
          videos: videoPaths,
          aiChecked: true,
          submitted: true,
          fundsSpent: index !== 0 ? Number(extraInput) || 0 : undefined,
        };

        progress = new ProgressReport({
          villageID,
          villageName,
          district,
          state,
          userEmail,
          userName,
          contactInfo,
          totalFundsAllocated: index === 0 ? Number(totalFundsAllocated) || 0 : 0,
          reports: newReports,
        });

        await progress.save();
        return res
          .status(201)
          .json({ message: "Report submitted successfully.", progress });
      }

      // Prevent resubmission
      if (progress.reports[index]?.submitted) {
        return res
          .status(400)
          .json({ message: "This report has already been submitted." });
      }

      // Update report details
      progress.reports[index] = {
        ...progress.reports[index],
        title,
        description,
        photos: photoPaths,
        videos: videoPaths,
        aiChecked: true,
        submitted: true,
        fundsSpent: index !== 0 ? Number(extraInput) || 0 : undefined,
      };

      // Store total funds if it's the first report (current condition)
      if (index === 0 && !progress.totalFundsAllocated) {
        progress.totalFundsAllocated = Number(totalFundsAllocated);
      }

      await progress.save();
      res
        .status(200)
        .json({ message: "Report updated successfully.", progress });
    } catch (error) {
      console.error("Error submitting report:", error);
      res.status(500).json({ message: "Server error", error: error.toString() });
    }
  }
);
//------------------------------------------------------------
// GET all reports by user email
// ------------------------------------------------------------
router.get("/user/:userEmail", async (req, res) => {
  try {
    const { userEmail } = req.params;
    const reports = await ProgressReport.find({ userEmail });
    if (!reports || reports.length === 0)
      return res.status(404).json({ message: "No reports found for this user." });
    res
      .status(200)
      .json({ message: "Reports fetched successfully.", count: reports.length, data: reports });
  } catch (error) {
    console.error("Error fetching reports by user email:", error);
    res.status(500).json({ message: "Server error", error: error.toString() });
  }
});
// ------------------------------------------------------------
//GET reports for a village & user
//------------------------------------------------------------
router.get("/:villageID/:userEmail", async (req, res) => {
  try {
    const { villageID, userEmail } = req.params;
    const progress = await ProgressReport.findOne({ villageID, userEmail });
    if (!progress)
      return res
        .status(404)
        .json({ message: "No reports found for this user in this villa." });
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ------------------------------------------------------------
// GET all reports (admin)
// ------------------------------------------------------------
router.get("/", async (req, res) => {
  try {
    const reports = await ProgressReport.find();
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reports", error });
  }
});

module.exports = router;
