import fs from "fs";
import Submission from "../models/submissionModel.js";
import Problem from "../models/problemModel.js";
import { generateFile } from "../compiler/generateFile.js";
import { executeCode } from "../compiler/executeCode.js";

const languageMap = {
  Java: "java",
  C: "c",
  CPP: "cpp",
  Python: "py",
};

export const createSubmission = async (req, res) => {
  try {
    const { problemId, problemTitle, language, code } = req.body;
    const submission = await Submission.create({
      userEmail: req.user.email,
      problemId,
      problemTitle,
      language,
      code,
      status: "Running",
      verdict: "Running",
    });
    void evaluateSubmission(submission);
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
    const problem = await Problem.findOne({ id: submission.problemId }).lean();
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
    const msg = (error.message || "").toLowerCase();
    if (msg.includes("time limit exceeded")) {
      submission.status = "Time Limit Exceeded";
      submission.verdict = "Time Limit Exceeded";
    } else if (
      msg.includes("memory limit exceeded") ||
      msg.includes("outofmemoryerror") ||
      msg.includes("java heap space")
    ) {
      submission.status = "Memory Limit Exceeded";
      submission.verdict = "Memory Limit Exceeded";
    } else if (
      msg.includes("runtime error") ||
      msg.includes("exception") ||
      msg.includes("segmentation fault") ||
      msg.includes("core dumped") ||
      msg.includes("floating point exception") ||
      msg.includes("zerodivisionerror") ||
      msg.includes("indexerror") ||
      msg.includes("valueerror") ||
      msg.includes("typeerror") ||
      msg.includes("nameerror")
    ) {
      submission.status = "Runtime Error";
      submission.verdict = "Runtime Error";
    } else if (
      msg.includes("error:") ||
      msg.includes("syntaxerror") ||
      msg.includes("indentationerror") ||
      msg.includes("importerror") ||
      msg.includes("modulenotfounderror") ||
      msg.includes("compilation")
    ) {
      submission.status = "Compilation Error";
      submission.verdict = "Compilation Error";
    } else {
      submission.status = "Internal Error";
      submission.verdict = "Internal Error";
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
    const submissions = await Submission.find({
      problemId,
      userEmail: req.user.email,
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
    const submission = await Submission.findOne({
      _id: req.params.id,
      userEmail: req.user.email,
    });

    if (!submission) {
      return res.status(404).json({
        message: "Submission not found",
      });
    }

    res.json(submission);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
