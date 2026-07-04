import express from "express";
import {
  getProblems,
  getProblemById,
  getProblemStatuses,
} from "../controllers/problemController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/api/problems", getProblems);
router.get("/api/problems/status", authMiddleware, getProblemStatuses);
router.get("/api/problems/:id", getProblemById);

export default router;
