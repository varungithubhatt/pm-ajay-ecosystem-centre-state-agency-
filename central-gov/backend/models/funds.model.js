import mongoose from "mongoose";


const fundAllocationSchema = new mongoose.Schema({
  scheme: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Scheme",
    required: true
  },
  stateUT: {
    type: String, // e.g., "Haryana", "Delhi", "UP"
    required: true
  },

  village:{
    type:String,
    required:true
  },
  allocatedAmount: {
    type: Number,
    required: true
  },
  releasedAmount: {
    type: Number,
    default: 0
  },
  utilizationStatus: {
    type: String,
    enum: ["Pending", "Partially Utilized", "Fully Utilized"],
    default: "Pending"
  },
  utilizationReport: {
    type: String // link to PDF/Document/report
  },
  allocationDate: {
    type: Date,
    default: Date.now
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  deadline: {
    type: Date
  }
}, { timestamps: true });

export default mongoose.model("FundAllocation", fundAllocationSchema, "village-funds");
