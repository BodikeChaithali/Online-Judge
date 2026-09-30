import express from "express";
import { runCode } from "../controllers/compilerController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/api/run", authMiddleware, runCode);

export default router;
