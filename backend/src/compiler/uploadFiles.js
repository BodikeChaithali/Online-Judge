import fs from "fs";
import tar from "tar-stream";

export const uploadFiles = async (container, files) => {
  const pack = tar.pack();

  for (const file of files) {
    const content = await fs.promises.readFile(file.path);

    pack.entry(
      {
        name: file.name,
      },
      content,
    );
  }

  pack.finalize();

  await container.putArchive(pack, {
    path: "/code",
  });
};
