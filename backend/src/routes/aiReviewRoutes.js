import express from "express";
import { generateReview } from "../controllers/aiReviewController.js";

const router = express.Router();
router.post("/ai-review", generateReview);
export default router;
