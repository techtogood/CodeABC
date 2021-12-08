import objectsFiles from "./objects-files";
import audioFiles from "./audio-files";
import mainFiles from "./main-files";
import roleFiles from "./role-files";
import spritesFiles from "./sprites-files";
export default {
  preload: {
    files: [
      ...objectsFiles,
      ...audioFiles,
      ...mainFiles,
      ...roleFiles,
      ...spritesFiles,
    ],
  },
};
