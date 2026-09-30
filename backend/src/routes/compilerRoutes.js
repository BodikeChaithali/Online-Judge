import express from "express";
import { runCode } from "../controllers/compilerController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { runRateLimiter } from "../middleware/runRateLimiter.js"; 

const router = express.Router();

router.post("/api/run", authMiddleware, runRateLimiter, runCode); 

export default router;
