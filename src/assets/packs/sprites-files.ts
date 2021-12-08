/**
 * 单独加载每一个雪碧图
 */
const modeuleMap = new Map();
if (process.env.BUILDTOOLS !== "webpack") {
  const context = import.meta.globEager("../sprites/*.png");
  Object.entries(context).forEach(([key, module]) => {
    modeuleMap.set(key.replace(/(\.\.\/sprites\/|\.png)/g, ""), module.default);
  });
} else {
  const context = require.context("../sprites/", true, /.png$/);
  context.keys().forEach((file) => {
    modeuleMap.set(
      file.replace(/[\.]\//g, "").replace(".png", ""),
      require("../sprites/" + file.replace("./", ""))
    );
  });
}

export default [
  {
    type: "spritesheet",
    key: "roleSprites",
    url: modeuleMap.get("roleSprites"),
    frameConfig: {
      frameWidth: 113,
      frameHeight: 108,
    },
  },
];
