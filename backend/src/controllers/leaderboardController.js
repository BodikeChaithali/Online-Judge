import Submission from "../models/submissionModel.js";
import { aggregateLeaderboard } from "../utils/leaderboardUtils.js";

export const getLeaderboard = async (req, res) => {
  try {
    const results = await aggregateLeaderboard(Submission);

    const leaderboard = results.map((entry, index) => ({
      rank: index + 1,
      userId: entry.userId,
      username: entry.username || "Anonymous",
      email: entry.userEmail,
      score: entry.score,
      solved: entry.solved,
    }));

    return res.status(200).json(leaderboard);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
