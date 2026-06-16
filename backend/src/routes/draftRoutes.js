import express from "express";

import { saveDraft, getDraft , deleteLanguageDraft } from "../controllers/draftController.js";

const router = express.Router();

router.post("/draft", saveDraft);

router.get("/draft/:email/:problemId", getDraft);

router.delete("/draft", deleteLanguageDraft);

export default router;
