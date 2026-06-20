import fs from "fs";
import Submission from "../models/submissionModel.js";
import { generateFile } from "../compiler/generateFile.js";
import { executeCode } from "../compiler/executeCode.js";
import { problems } from "../data/problems.js";

const languageMap = {
  Java: "java",
  C: "c",
  CPP: "cpp",
  Python: "py",
};

export const createSubmission = async (req, res) => {
  try {
    const { userEmail, problemId, problemTitle, language, code } = req.body;
    const submission = await Submission.create({
      userEmail,
      problemId,
      problemTitle,
      language,
      code,
      status: "Running",
      verdict: "Running",
    });
    evaluateSubmission(submission);
    return res.status(201).json(submission);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

async function evaluateSubmission(submission) {
  let jobDir = null;
  try {
    const problem = problems.find((p) => p.id === submission.problemId);
    if (!problem) {
      submission.status = "Wrong Answer";
      submission.verdict = "Problem not configured";
      await submission.save();
      return;
    }
    const result = await generateFile(
      languageMap[submission.language],
      submission.code,
    );
    jobDir = result.jobDir;
    for (const testCase of problem.hiddenTests) {
      const output = await executeCode(
        languageMap[submission.language],
        result.filePath,
        testCase.input,
      );
      if (output.trim() !== testCase.output.trim()) {
        submission.status = "Wrong Answer";
        submission.verdict = "Wrong Answer";
        await submission.save();
        return;
      }
    }
    submission.status = "Accepted";
    submission.verdict = "Accepted";
    await submission.save();
  } catch (error) {
    const msg = error.message || "";
    if (msg.includes("Time Limit Exceeded")) {
      submission.status = "Time Limit Exceeded";
      submission.verdict = "Time Limit Exceeded";
    } else if (msg.includes("Exception")) {
      submission.status = "Runtime Error";
      submission.verdict = "Runtime Error";
    } else {
      submission.status = "Compilation Error";
      submission.verdict = "Compilation Error";
    }
    await submission.save();
  } finally {
    if (jobDir && fs.existsSync(jobDir)) {
      fs.rmSync(jobDir, {
        recursive: true,
        force: true,
      });
    }
  }
}

export const getProblemSubmissions = async (req, res) => {
  try {
    const { problemId } = req.params;
    const { email } = req.query;
    const submissions = await Submission.find({
      problemId,
      userEmail: email,
    }).sort({
      createdAt: -1,
    });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getSubmission = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);
    res.json(submission);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
