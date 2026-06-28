import fs from "fs";
import { exec } from "child_process";
import path from "path";

export const executeCode = (language, filePath, input = "") => {
  const jobDir = path.dirname(filePath);
  const inputPath = path.join(jobDir, "input.txt");

  fs.writeFileSync(inputPath, input);

  let command = "";

  switch (language) {
    case "py":
      command = "python3 /code/code.py < /code/input.txt";
      break;

    case "c":
      command =
        "gcc /code/code.c -o /code/a.out && /code/a.out < /code/input.txt";
      break;

    case "cpp":
      command =
        "g++ /code/code.cpp -o /code/a.out && /code/a.out < /code/input.txt";
      break;

    case "java":
      command =
        "javac /code/Main.java && java -cp /code Main < /code/input.txt";
      break;

    default:
      return Promise.reject(new Error("Unsupported language"));
  }

  const hostProjectPath = process.env.HOST_PROJECT_PATH;

  if (!hostProjectPath) {
    return Promise.reject(
      new Error("HOST_PROJECT_PATH environment variable not configured"),
    );
  }

  const hostJobDir = jobDir.replace("/app", hostProjectPath);

  const dockerCommand = `docker run --rm \
-v "${hostJobDir}:/code:rw" \
-w /code \
--network none \
--memory=256m \
--cpus=1 \
--pids-limit=100 \
--cap-drop=ALL \
--security-opt=no-new-privileges \
--tmpfs /tmp:size=64m \
onlinejudge-sandbox \
bash -c '${command}'`;

  return new Promise((resolve, reject) => {
    exec(
      dockerCommand,
      {
        timeout: 5000,
      },
      (error, stdout, stderr) => {
        if (error?.killed) {
          return reject(new Error("Time Limit Exceeded"));
        }

        if (error) {
          return reject(new Error(stderr || error.message));
        }

        resolve(stdout.trim());
      },
    );
  });
};
