import express from "express";
import {
  createSubmission,
  getProblemSubmissions,
  getSubmission,
} from "../controllers/submissionController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/api/submissions", authMiddleware, createSubmission);
router.get("/api/submissions/problem/:problemId", authMiddleware, getProblemSubmissions);
router.get("/api/submissions/:id", authMiddleware, getSubmission);
export default router;
