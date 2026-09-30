import express from "express";
import {
  createSubmission,
  getProblemSubmissions,
  getSubmission,
} from "../controllers/submissionController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { submitRateLimiter } from "../middleware/submitRateLimiter.js";

const router = express.Router();

router.post("/api/submissions", authMiddleware, submitRateLimiter, createSubmission); 
router.get("/api/submissions/problem/:problemId", authMiddleware, getProblemSubmissions);
router.get("/api/submissions/:id", authMiddleware, getSubmission);
export default router;
