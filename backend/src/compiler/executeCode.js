import fs from "fs";
import { exec } from "child_process";
import path from "path";

export const executeCode = (language, filePath, input = "") => {
  let command = "";

  const jobDir = path.dirname(filePath);

  const inputPath = path.join(jobDir, "input.txt");

  fs.writeFileSync(inputPath, input);

  if (language === "py") {
    command = `python3 "${filePath}" < "${inputPath}"`;
  } else if (language === "c") {
    const outputPath = path.join(jobDir, "a.out");

    command = `gcc "${filePath}" -o "${outputPath}" && "${outputPath}" < "${inputPath}"`;
  } else if (language === "cpp") {
    const outputPath = path.join(jobDir, "a.out");

    command = `g++ "${filePath}" -o "${outputPath}" && "${outputPath}" < "${inputPath}"`;
  } else if (language === "java") {
    command = `javac "${filePath}" && java -cp "${jobDir}" Main < "${inputPath}"`;
  }

  if (!command) {
    return Promise.reject(new Error("Unsupported language"));
  }

  return new Promise((resolve, reject) => {
    exec(command, { timeout: 5000 }, (error, stdout, stderr) => {
      if (error?.killed) {
        reject(new Error("Time Limit Exceeded"));
        return;
      }
      if (error) {
        reject(new Error(stderr || error.message));
        return;
      }
      resolve(stdout.trim());
    });
  });
};
