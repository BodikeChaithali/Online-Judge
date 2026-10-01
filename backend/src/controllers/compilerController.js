import fs from "fs";
import { generateFile } from "../compiler/generateFile.js";
import { executeCode } from "../compiler/executeCode.js";

const isMissingInputError = (message = "") =>
  /\bEOFError\b/.test(message) ||
  (/\bNoSuchElementException\b/.test(message) &&
    /java\.util\.Scanner/.test(message));

export const runCode = async (req, res) => {
  let jobDir = null;
  const { language, code, input } = req.body || {};
  try {
    if (!code) {
      return res.status(400).json({
        success: false,
        error: "Code is required",
      });
    }
    const result = await generateFile(language, code);
    const filePath = result.filePath;
    jobDir = result.jobDir;
    const output = await executeCode(language, filePath, input || "");
    return res.json({
      success: true,
      output,
    });
  } catch (err) {
    let type = "ERROR";
    let error = err.message || String(err);

    if (err.message === "Time Limit Exceeded") {
      type = "TLE";
    } else if (err.message === "Memory Limit Exceeded") {
      type = "MLE";
    } else if (err.message === "Internal Error") {
      type = "INTERNAL";
    } else if (err.message === "Runtime Error") {
      type = "RUNTIME";
    } else if (isMissingInputError(err.message)) {
      type = "NO_INPUT";
      error = (input || "").trim()
        ? "Your program tried to read more input than was provided.\n\n" +
          "Check that the Input tab contains every value your program expects (one per line, or separated as your code reads them)."
        : "Your program tried to read input, but no input was provided.\n\n" +
          "Open the Input tab, type the input your program expects, then run again.";
    }

    return res.status(400).json({
      success: false,
      error,
      type,
    });
  } finally {
    if (jobDir && fs.existsSync(jobDir)) {
      fs.rmSync(jobDir, {
        recursive: true,
        force: true,
      });
    }
  }
};
