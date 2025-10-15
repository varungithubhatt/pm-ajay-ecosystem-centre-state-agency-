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
    district: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    fundsAllocated: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("VillageFunds", villageSchema, "village-funds");
