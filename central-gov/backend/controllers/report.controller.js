import fs from "fs";
import path from "path";
import multer from "multer";
import FundAllocation from "../models/funds.model.js";

import PDFDocument from "pdfkit"; // for PDF generation

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const uniqueName = `report-${Date.now()}.pdf`;
    cb(null, uniqueName);
  },
});
export const upload = multer({ storage });

// Generate Report Controller
// Generate Report Controller
export const generateReport = async (req, res) => {
  try {
    const { reportType } = req.body; // e.g. "state" or "scheme"

    // Fetch fund allocations
    const allocations = await FundAllocation.find()
      .populate("scheme", "schemeName")
      .lean();

    // Ensure reports folder exists
    const reportsDir = path.join("uploads", "reports");
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    // Create PDF
    const doc = new PDFDocument();
    const filePath = path.join(reportsDir, `report-${Date.now()}.pdf`);
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Title
    doc.fontSize(18).text("Government Fund Allocation Report", { align: "center" });
    doc.moveDown();

    // Type
    doc.fontSize(12).text(`Report Type: ${reportType.toUpperCase()}`);
    doc.moveDown(1);

    // Table
    allocations.forEach((alloc, index) => {
      doc.text(`${index + 1}. Scheme: ${alloc.scheme.schemeName}`);
      doc.text(`   State/UT: ${alloc.stateUT}`);
      doc.text(`   Village: ${alloc.village}`);
      doc.text(`   Allocated: ₹${alloc.allocatedAmount}`);
      doc.text(`   Released: ₹${alloc.releasedAmount}`);
      doc.text(`   Status: ${alloc.utilizationStatus}`);
      doc.moveDown(0.5);
    });

    doc.end();

    // Wait for stream finish
    stream.on("finish", () => {
      res.status(200).json({
        message: "Report generated successfully",
        filePath: filePath,
      });
    });
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ message: "Failed to generate report" });
  }
};
