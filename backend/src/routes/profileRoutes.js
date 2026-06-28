import express from "express";
import {
  getProfileStats,
  getProblemStatuses,
} from "../controllers/profileController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/api/profile/stats", authMiddleware, getProfileStats);
router.get("/profile/stats", authMiddleware, getProfileStats);
router.get("/api/problems/status", authMiddleware, getProblemStatuses);
router.get("/problems/status", authMiddleware, getProblemStatuses);

export default router;
