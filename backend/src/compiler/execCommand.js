import { Writable } from "stream";

export const execCommand = async (container, command, timeout = 5000) => {
  const exec = await container.exec({
    Cmd: ["bash", "-c", command],
    AttachStdout: true,
    AttachStderr: true,
  });

  const stream = await exec.start({});

  let output = "";

  const writable = new Writable({
    write(chunk, encoding, callback) {
      output += chunk.toString();
      callback();
    },
  });

  container.modem.demuxStream(stream, writable, writable);

  const executionPromise = new Promise((resolve, reject) => {
    stream.on("end", async () => {
      try {
        const inspect = await exec.inspect();
        if (inspect.ExitCode === 137) {
          return reject(new Error("Memory Limit Exceeded"));
        }
        if (inspect.ExitCode === 139) {
          return reject(new Error("Runtime Error"));  
        }

        if (inspect.ExitCode !== 0) {
          if (output.trim() === "") {
            return reject(new Error("Internal Error"));
          }

          return reject(new Error(output.trim()));
        }

        resolve(output.trim());
      } catch (err) {
        reject(err);
      }
    });

    stream.on("error", reject);
  });

  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(async () => {
      try {
        await container.kill();
      } catch {}

      reject(new Error("Time Limit Exceeded"));
    }, timeout);
  });

  return Promise.race([executionPromise, timeoutPromise]);
};
