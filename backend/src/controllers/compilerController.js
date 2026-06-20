import fs from "fs";
import { generateFile } from "../compiler/generateFile.js";
import { executeCode } from "../compiler/executeCode.js";

export const runCode = async (req, res) => {
  let jobDir = null;
  try {
    const { language, code, input } = req.body;
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
    return res.status(400).json({
      success: false,
      error: err.message || String(err),
      type: err.message === "Time Limit Exceeded" ? "TLE" : "ERROR",
    });
  } 
  finally {
    if (jobDir && fs.existsSync(jobDir)) {
      fs.rmSync(jobDir, {
        recursive: true,
        force: true,
      });
    }
  }
};
