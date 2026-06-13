import fs from "fs";
import path from "path";
import { v4 as uuid } from "uuid";

export const generateFile = async (language, code) => {
  const extensionMap = {
    py: "py",
    c: "c",
    cpp: "cpp",
    java: "java",
  };

  if (!language) {
    throw new Error("Language is required");
  }

  const extension = extensionMap[language];

  if (!extension) {
    throw new Error("Unsupported language");
  }
  const jobId = uuid();

  const jobDir = path.join(process.cwd(), "src/compiler/Jobs", jobId);

  await fs.promises.mkdir(jobDir, {
    recursive: true,
  });

  if (language === "java" && !code.includes("public class Main")) {
    throw new Error("Java code must contain 'public class Main'");
  }

  const fileName = language === "java" ? "Main.java" : `code.${extension}`;

  const filePath = path.join(jobDir, fileName);

  await fs.promises.writeFile(filePath, code);

  return {
    filePath,
    jobDir,
  };
};
