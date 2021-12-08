//加载该路径下的所有文件
let levelModules;
if (process.env.BUILDTOOLS !== "webpack") {
  const context = import.meta.globEager("../image/objects/**/*.png");
  levelModules = Object.entries(context).map(([key, module]) => ({
    type: "image",
    key: key.replace(/(\.\.\/image\/objects\/|\.png)/g, "").replace(/\//, "_"),
    url: module.default,
  }));
} else {
  const context = require.context("../image/objects/", true, /.png$/);
  levelModules = context.keys().map((file) => {
    return {
      type: "image",
      key: file
        .replace(/[\.]\//g, "")
        .replace(/\//g, "_")
        .replace(".png", ""),
      url: require("../image/objects/" + file.replace("./", "")),
    };
  });
}

export default levelModules;
