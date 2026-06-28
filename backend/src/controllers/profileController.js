import Submission from "../models/submissionModel.js";
import {
  aggregateLeaderboard,
  aggregateUserStats,
  findUserRank,
} from "../utils/leaderboardUtils.js";

export const getProfileStats = async (req, res) => {
  try {
    const userEmail = req.user.email;
    const username = `${req.user.firstName} ${req.user.lastName}`.trim();

    const [stats, leaderboardEntries] = await Promise.all([
      aggregateUserStats(Submission, userEmail),
      aggregateLeaderboard(Submission),
    ]);

    const rank = findUserRank(leaderboardEntries, userEmail);
    const leaderboardEntry = leaderboardEntries.find(
      (entry) => entry.userEmail === userEmail,
    );

    return res.status(200).json({
      username,
      email: userEmail,
      rank,
      score: leaderboardEntry?.score ?? stats.score,
      solved: stats.solved,
      easy: stats.easy,
      medium: stats.medium,
      hard: stats.hard,
      totalSubmissions: stats.totalSubmissions,
      accepted: stats.accepted,
      wrongAnswer: stats.wrongAnswer,
      timeLimitExceeded: stats.timeLimitExceeded,
      runtimeError: stats.runtimeError,
      compilationError: stats.compilationError,
      acceptanceRate: stats.acceptanceRate,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
