import express from "express";
import { runCode } from "../controllers/compilerController.js";

const router = express.Router();

router.post("/api/run", runCode);

export default router;
