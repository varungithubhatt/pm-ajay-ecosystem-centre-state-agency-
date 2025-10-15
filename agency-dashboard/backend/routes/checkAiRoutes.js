import express from "express";
import multer from "multer";

const router = express.Router();

// Configure multer for memory storage (we can send buffer to AI check service)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST /api/check-ai
// Checks uploaded files for AI-generated content
router.post("/", upload.array("files"), async (req, res) => {
  try {
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    // TODO: Replace this with actual AI detection logic
    // For demonstration, let's assume images/videos with size > 10MB are "AI-generated"
    const isAIGenerated = files.some((file) => file.size > 10 * 1024 * 1024);

    return res.status(200).json({ isAIGenerated });
  } catch (err) {
    console.error("AI check failed:", err);
    res.status(500).json({ message: "AI check failed" });
  }
});

export default router;
