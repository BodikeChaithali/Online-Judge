import express from "express";
import { getProfileStats } from "../controllers/profileController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/api/profile/stats", authMiddleware, getProfileStats);
router.get("/profile/stats", authMiddleware, getProfileStats);

export default router;
