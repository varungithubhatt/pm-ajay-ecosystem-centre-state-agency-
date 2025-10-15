import ProgressReport from "../models/ProgressReports.js";

// ✅ Get all progress reports
export const getAllProgressReports = async (req, res) => {
  try {
    const reports = await ProgressReport.find().sort({ createdAt: -1 }); // latest first
    res.status(200).json({
      message: "All progress reports fetched successfully",
      data: reports,
    });
  } catch (error) {
    console.error("Error fetching progress reports:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
