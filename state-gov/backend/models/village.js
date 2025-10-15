const mongoose = require("mongoose");
const { Schema } = mongoose;

const villageSchema = new Schema(
  {
    villageID: {
      type: Number,
      required: true,
      unique: true,
      trim: true,
    },
    villageName: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    district: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
    },
    description: {
      population: {
        type: Number,
        default: 0,
      },
      scPercentage: {
        type: Number,
        min: 0,
        max: 100,
      },
      stPercentage: {
        type: Number,
        min: 0,
        max: 100,
      },
      nonScStPercentage: {
        type: Number,
        min: 0,
        max: 100,
      },
      developmentRate: {
        type: Number,
        min: 0,
        max: 100,
      },
      problems: {
        type: Map,
        of: String, // allows dynamic key-value pairs like { "water": "scarcity" }
      },
      lastSelectedForPMAjay: {
        type: Date,
      },
      otherDetails: {
        type: Map,
        of: String,
      },
    },
    fundAllocations: [
    {
      amount: Number,
      allocatedBy: String, // admin or officer
      allocatedAt: { type: Date, default: Date.now },
    },
  ],
    developmentTasks: [
      {
        taskID: {
          type: String,
          required: true,
        },
        taskName: {
          type: String,
          required: true,
        },
        priority: {
          type: String,
          enum: ["Low", "Medium", "High"], // Enforces controlled values
          default: "Medium",
        },
      },
    ],
    upload_data: {
      uploadedBy: {
        type: String,
        required: true,
      },
      uploadDate: {
        type: Date,
        default: Date.now,
      },
    },
  },
  { timestamps: true }
);
// Export schema only (not model)
module.exports = villageSchema;