import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: true,
    },
    problemId: {
      type: Number,
      required: true,
    },
    problemTitle: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "Pending",
        "Running",
        "Accepted",
        "Wrong Answer",
        "Compilation Error",
        "Runtime Error",
        "Time Limit Exceeded",
      ],
      default: "Pending",
    },
    verdict: {
      type: String,
      default: "",
    },
  },
  
  {
    timestamps: true,
  },
);

export default mongoose.model("Submission", submissionSchema);
