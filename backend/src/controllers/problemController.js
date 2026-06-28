import Problem from "../models/problemModel.js";
import Submission from "../models/submissionModel.js";
import { aggregateProblemStatuses } from "../utils/leaderboardUtils.js";

const listProjection = {
  id: 1,
  title: 1,
  difficulty: 1,
  tags: 1,
  _id: 0,
};

const detailProjection = {
  hiddenTests: 0,
  __v: 0,
};

export const getProblems = async (req, res) => {
  try {
    const problems = await Problem.find({})
      .select(listProjection)
      .sort({ id: 1 })
      .lean();

    return res.status(200).json(problems);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getProblemById = async (req, res) => {
  try {
    const problemId = Number(req.params.id);

    if (Number.isNaN(problemId)) {
      return res.status(400).json({
        message: "Invalid problem id",
      });
    }

    const problem = await Problem.findOne({ id: problemId })
      .select(detailProjection)
      .lean();

    if (!problem) {
      return res.status(404).json({
        message: "Problem not found",
      });
    }

    return res.status(200).json(problem);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getProblemStatuses = async (req, res) => {
  try {
    const statuses = await aggregateProblemStatuses(
      Submission,
      req.user.email,
    );

    return res.status(200).json(statuses);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
