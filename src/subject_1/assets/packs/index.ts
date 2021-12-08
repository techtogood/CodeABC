/**
 * @file 主题一中的图片资源
 */
let levelModules;
if (process.env.BUILDTOOLS !== "webpack") {
  const context = import.meta.globEager("../image/**/*.png");
  levelModules = Object.entries(context).map(([key, module]) => ({
    type: "image",
    key: `subject_1${key
      .replace(/(\.png)|(\.\.\/image)/g, "")
      .replace(/\//g, "_")}`,
    url: module.default,
  }));
} else {
  const context = require.context("../image/", true, /.png$/);
  levelModules = context.keys().map((file) => {
    return {
      type: "image",
      key: "subject_1" + file.replace(/[\.]?\//g, "_").replace(".png", ""),
      url: require("../image/" + file.replace("./", "")),
    };
  });
}

export default {
  preload: {
    files: levelModules,
  },
};
