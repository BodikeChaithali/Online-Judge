import express from "express";

import { saveDraft, getDraft , deleteLanguageDraft } from "../controllers/draftController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/api/draft", authMiddleware, saveDraft);
router.get("/api/draft/:problemId", authMiddleware, getDraft);
router.delete("/api/draft", authMiddleware, deleteLanguageDraft);

export default router;
