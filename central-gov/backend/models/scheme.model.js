import mongoose from "mongoose";

const schemeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },


  stateUT: {
      type: String,
      required: true,
      trim: true,
    },

    // ✅ NEW FIELD — Optional, for rural programs or village-level implementation
    village: {
      type: String,
      trim: true,
    },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String, // e.g., "Adarsh Gram", "Hostel", "GIA"
    required: true
  },
  launchDate: {
    type: Date,
    default: Date.now
  },
  guidelines: {
    type: String // URL or document reference
  },
  eligibilityCriteria: {
    type: String
  },
  deadline: {
    type: Date
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // who uploaded the scheme
    required: true
  }
}, { timestamps: true });

export default mongoose.model("Scheme", schemeSchema);
