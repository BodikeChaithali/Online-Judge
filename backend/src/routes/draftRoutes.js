import express from "express";

import { saveDraft, getDraft , deleteLanguageDraft } from "../controllers/draftController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/draft", authMiddleware, saveDraft);
router.get("/draft/:problemId", authMiddleware, getDraft);
router.delete("/draft", authMiddleware, deleteLanguageDraft);

export default router;
