import path from "path";
import fs from "fs";

import { createSandboxContainer } from "./containerManager.js";
import { uploadFiles } from "./uploadFiles.js";
import { execCommand } from "./execCommand.js";

export const executeCode = async (language, filePath, input = "") => {
  const container = await createSandboxContainer();

  const inputPath = path.join(path.dirname(filePath), "input.txt");

  await fs.promises.writeFile(inputPath, input);

  let fileName;
  let command;

  switch (language) {
    case "py":
      fileName = "code.py";
      command = "timeout 5s bash -c 'python3 code.py < input.txt'";
      break;

    case "c":
      fileName = "code.c";
      command = "timeout 5s bash -c 'gcc code.c -o main && ./main < input.txt'";
      break;

    case "cpp":
      fileName = "code.cpp";
      command = "timeout 5s bash -c 'g++ code.cpp -o main && ./main < input.txt'";
      break;

    case "java":
      fileName = "Main.java";
      command = "timeout 5s bash -c 'javac Main.java && java Main < input.txt'";
      break;

    default:
      throw new Error("Unsupported language");
  }

  try {
    await uploadFiles(container, [
      {
        name: fileName,
        path: filePath,
      },
      {
        name: "input.txt",
        path: inputPath,
      },
    ]);

    const output = await execCommand(container, command);

    return output;
  } finally {
    await container.remove({ force: true }).catch(() => {});
  }
};
