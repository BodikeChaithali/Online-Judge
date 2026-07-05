import docker from "./docker.js";

export const createSandboxContainer = async () => {
  const container = await docker.createContainer({
    Image: "onlinejudge-sandbox",
    Tty: false,
    WorkingDir: "/code",
    Cmd: ["sleep", "300"],

    HostConfig: {
      NetworkMode: "none",
      Memory: 256 * 1024 * 1024,
      MemorySwap: 256 * 1024 * 1024,
      NanoCpus: 1_000_000_000,
      PidsLimit: 100,
      CapDrop: ["ALL"],
      AutoRemove: true,
      Tmpfs: {
        "/tmp": "size=64m",
      },
    },
  });

  await container.start();

  return container;
};
