import mongoose from "mongoose";

const villageFundsSchema = new mongoose.Schema(
  {
    villageID: {
      type: Number,
      required: true,
      unique: true,
    },
    villageName: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    fundsAllocated: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
    collection: "village-funds", // explicitly set collection name
  }
);

const VillageFunds = mongoose.model("VillageFunds", villageFundsSchema);

export default VillageFunds;
