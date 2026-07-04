import express from "express";
import { generateReview } from "../controllers/aiReviewController.js";
import authMiddleware from "../middleware/authMiddleware.js";


const router = express.Router();
router.post("/api/ai-review",authMiddleware, generateReview);
export default router;
