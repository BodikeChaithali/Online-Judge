import { problems } from "../data/problems.js";

export const DIFFICULTY_POINTS = {
  Easy: 1,
  Medium: 2,
  Hard: 3,
};

export const problemsCatalog = problems.map((problem) => ({
  problemId: problem.id,
  difficulty: problem.difficulty,
  points: DIFFICULTY_POINTS[problem.difficulty] ?? 0,
}));

const difficultyPointsStage = {
  $addFields: {
    points: {
      $let: {
        vars: {
          matched: {
            $arrayElemAt: [
              {
                $filter: {
                  input: { $literal: problemsCatalog },
                  as: "problem",
                  cond: {
                    $eq: ["$$problem.problemId", "$_id.problemId"],
                  },
                },
              },
              0,
            ],
          },
        },
        in: { $ifNull: ["$$matched.points", 0] },
      },
    },
    difficulty: {
      $let: {
        vars: {
          matched: {
            $arrayElemAt: [
              {
                $filter: {
                  input: { $literal: problemsCatalog },
                  as: "problem",
                  cond: {
                    $eq: ["$$problem.problemId", "$_id.problemId"],
                  },
                },
              },
              0,
            ],
          },
        },
        in: { $ifNull: ["$$matched.difficulty", "Unknown"] },
      },
    },
  },
};

const uniqueProblemDifficultyStage = {
  $addFields: {
    points: {
      $let: {
        vars: {
          matched: {
            $arrayElemAt: [
              {
                $filter: {
                  input: { $literal: problemsCatalog },
                  as: "problem",
                  cond: {
                    $eq: ["$$problem.problemId", "$_id"],
                  },
                },
              },
              0,
            ],
          },
        },
        in: { $ifNull: ["$$matched.points", 0] },
      },
    },
    difficulty: {
      $let: {
        vars: {
          matched: {
            $arrayElemAt: [
              {
                $filter: {
                  input: { $literal: problemsCatalog },
                  as: "problem",
                  cond: {
                    $eq: ["$$problem.problemId", "$_id"],
                  },
                },
              },
              0,
            ],
          },
        },
        in: { $ifNull: ["$$matched.difficulty", "Unknown"] },
      },
    },
  },
};

export const aggregateLeaderboard = async (Submission) => {
  return Submission.aggregate([
    {
      $match: { status: "Accepted" },
    },
    {
      $group: {
        _id: { userEmail: "$userEmail", problemId: "$problemId" },
        firstAcceptedAt: { $min: "$createdAt" },
      },
    },
    difficultyPointsStage,
    {
      $group: {
        _id: "$_id.userEmail",
        solves: {
          $push: {
            firstAcceptedAt: "$firstAcceptedAt",
            points: "$points",
          },
        },
      },
    },
    {
      $addFields: {
        score: { $sum: "$solves.points" },
        solved: { $size: "$solves" },
        reachedAt: { $max: "$solves.firstAcceptedAt" },
      },
    },
    {
      $lookup: {
        from: "authusers",
        localField: "_id",
        foreignField: "email",
        as: "user",
      },
    },
    {
      $unwind: {
        path: "$user",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        _id: 0,
        userEmail: "$_id",
        userId: {
          $cond: {
            if: { $ifNull: ["$user._id", false] },
            then: { $toString: "$user._id" },
            else: null,
          },
        },
        username: {
          $cond: {
            if: {
              $and: [
                { $ifNull: ["$user.firstName", false] },
                { $ifNull: ["$user.lastName", false] },
              ],
            },
            then: {
              $trim: {
                input: {
                  $concat: ["$user.firstName", " ", "$user.lastName"],
                },
              },
            },
            else: {
              $arrayElemAt: [{ $split: ["$_id", "@"] }, 0],
            },
          },
        },
        score: 1,
        solved: 1,
        reachedAt: 1,
      },
    },
    {
      $sort: {
        score: -1,
        solved: -1,
        reachedAt: 1,
        username: 1,
        userEmail: 1,
      },
    },
  ]);
};

export const findUserRank = (leaderboardEntries, userEmail) => {
  const index = leaderboardEntries.findIndex(
    (entry) => entry.userEmail === userEmail,
  );
  return index === -1 ? null : index + 1;
};

export const aggregateUserStats = async (Submission, userEmail) => {
  const [result] = await Submission.aggregate([
    {
      $match: { userEmail },
    },
    {
      $facet: {
        verdictCounts: [
          {
            $group: {
              _id: null,
              totalSubmissions: { $sum: 1 },
              accepted: {
                $sum: {
                  $cond: [{ $eq: ["$status", "Accepted"] }, 1, 0],
                },
              },
              wrongAnswer: {
                $sum: {
                  $cond: [{ $eq: ["$status", "Wrong Answer"] }, 1, 0],
                },
              },
              timeLimitExceeded: {
                $sum: {
                  $cond: [
                    { $eq: ["$status", "Time Limit Exceeded"] },
                    1,
                    0,
                  ],
                },
              },
              runtimeError: {
                $sum: {
                  $cond: [{ $eq: ["$status", "Runtime Error"] }, 1, 0],
                },
              },
              compilationError: {
                $sum: {
                  $cond: [{ $eq: ["$status", "Compilation Error"] }, 1, 0],
                },
              },
            },
          },
        ],
        solvedProblems: [
          {
            $match: { status: "Accepted" },
          },
          {
            $group: {
              _id: "$problemId",
            },
          },
          uniqueProblemDifficultyStage,
          {
            $group: {
              _id: null,
              solved: { $sum: 1 },
              score: { $sum: "$points" },
              easy: {
                $sum: {
                  $cond: [{ $eq: ["$difficulty", "Easy"] }, 1, 0],
                },
              },
              medium: {
                $sum: {
                  $cond: [{ $eq: ["$difficulty", "Medium"] }, 1, 0],
                },
              },
              hard: {
                $sum: {
                  $cond: [{ $eq: ["$difficulty", "Hard"] }, 1, 0],
                },
              },
            },
          },
        ],
      },
    },
  ]);

  const counts = result?.verdictCounts?.[0] ?? {
    totalSubmissions: 0,
    accepted: 0,
    wrongAnswer: 0,
    timeLimitExceeded: 0,
    runtimeError: 0,
    compilationError: 0,
  };

  const solved = result?.solvedProblems?.[0] ?? {
    solved: 0,
    score: 0,
    easy: 0,
    medium: 0,
    hard: 0,
  };

  const acceptanceRate =
    counts.totalSubmissions > 0
      ? Number(
          ((counts.accepted / counts.totalSubmissions) * 100).toFixed(2),
        )
      : 0;

  return {
    totalSubmissions: counts.totalSubmissions,
    accepted: counts.accepted,
    wrongAnswer: counts.wrongAnswer,
    timeLimitExceeded: counts.timeLimitExceeded,
    runtimeError: counts.runtimeError,
    compilationError: counts.compilationError,
    solved: solved.solved,
    score: solved.score,
    easy: solved.easy,
    medium: solved.medium,
    hard: solved.hard,
    acceptanceRate,
  };
};

export const aggregateProblemStatuses = async (Submission, userEmail) => {
  return Submission.aggregate([
    {
      $match: { userEmail },
    },
    {
      $group: {
        _id: "$problemId",
        hasAccepted: {
          $max: {
            $cond: [{ $eq: ["$status", "Accepted"] }, 1, 0],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        problemId: { $toString: "$_id" },
        status: {
          $cond: [{ $eq: ["$hasAccepted", 1] }, "Solved", "Attempted"],
        },
      },
    },
  ]);
};
