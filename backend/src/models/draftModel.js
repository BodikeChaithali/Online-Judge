import mongoose from "mongoose";

const draftSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    lastLanguage: {
      type: String,
      default: "Java",
    },
    problemId: {
      type: Number,
      required: true,
    },
    drafts: {
      Java: String,
      C: String,
      CPP: String,
      Python: String,
    },
  },
  {
    timestamps: true,
  },
);

draftSchema.index(
  {
    email: 1,
    problemId: 1,
  },
  {
    unique: true,
  },
);

export default mongoose.model("Draft", draftSchema);