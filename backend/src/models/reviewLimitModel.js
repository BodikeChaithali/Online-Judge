import mongoose from "mongoose";

const reviewLimitSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: true,
      unique: true,
    },

    count: {
      type: Number,
      default: 0,
    },

    windowStart: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("ReviewLimit", reviewLimitSchema);
