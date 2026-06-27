import express from "express";
import {
  createSubmission,
  getProblemSubmissions,
  getSubmission,
} from "../controllers/submissionController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/submissions", authMiddleware, createSubmission);
router.get("/submissions/problem/:problemId", authMiddleware, getProblemSubmissions);
router.get("/submissions/:id", authMiddleware, getSubmission);
export default router;
