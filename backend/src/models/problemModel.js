import mongoose from "mongoose";

const testCaseSchema = new mongoose.Schema(
  {
    input: { type: String, required: true },
    output: { type: String, required: true },
  },
  { _id: false },
);

const problemSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    statement: {
      type: String,
      required: true,
    },
    examples: {
      type: [testCaseSchema],
      default: [],
    },
    constraints: {
      type: [String],
      default: [],
    },
    inputFormat: {
      type: String,
      default: "",
    },
    outputFormat: {
      type: String,
      default: "",
    },
    hiddenTests: {
      type: [testCaseSchema],
      default: [],
    },
    starterCode: {
      Java: { type: String, default: "" },
      C: { type: String, default: "" },
      CPP: { type: String, default: "" },
      Python: { type: String, default: "" },
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Problem", problemSchema);
