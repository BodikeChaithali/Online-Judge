import express from "express";
import { createSubmission, getProblemSubmissions, getSubmission, } from "../controllers/submissionController.js";

const router = express.Router();
router.post("/submissions", createSubmission);
router.get("/submissions/problem/:problemId", getProblemSubmissions);
router.get("/submissions/:id", getSubmission);

export default router;
