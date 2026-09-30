import { Writable } from "stream";

const MAX_OUTPUT_CHARS = 1024 * 1024;

export const execCommand = async (container, command) => {
  const exec = await container.exec({
    Cmd: ["bash", "-c", command],
    AttachStdout: true,
    AttachStderr: true,
  });

  const stream = await exec.start({});

  let output = "";
  let outputTooLarge = false;

  const writable = new Writable({
    write(chunk, encoding, callback) {
      if (!outputTooLarge) {
        output += chunk.toString();
        if (output.length > MAX_OUTPUT_CHARS) {
          outputTooLarge = true;
          output = "";
        }
      }
      callback();
    },
  });

  container.modem.demuxStream(stream, writable, writable);

  return new Promise((resolve, reject) => {
    stream.on("end", async () => {
      try {
        if (outputTooLarge) {
          return reject(
            new Error("Runtime Error: Output limit exceeded (over 1 MB)"),
          );
        }

        const inspect = await exec.inspect();
        const exitCode = inspect.ExitCode;

        if (exitCode === 0) {
          return resolve(output.trim());
        }

        if (exitCode === 124) {
          return reject(new Error("Time Limit Exceeded"));
        }

        if (exitCode === 137) {
          return reject(new Error("Memory Limit Exceeded"));
        }

        if (output.trim() === "") {
          return reject(new Error("Internal Error"));
        }

        return reject(new Error(output.trim()));
      } catch (err) {
        reject(err);
      }
    });

    stream.on("error", reject);
  });
};
