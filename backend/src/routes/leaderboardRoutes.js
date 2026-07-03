import express from "express";
import { getLeaderboard } from "../controllers/leaderboardController.js";

const router = express.Router();

router.get("/api/leaderboard", getLeaderboard);

export default router;
