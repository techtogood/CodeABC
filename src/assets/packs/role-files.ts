//加载该路径下的所有文件
let levelModules;
if (process.env.BUILDTOOLS !== "webpack") {
  const context = import.meta.globEager("../image/role/*.png");
  levelModules = Object.entries(context).map(([key, module]) => ({
    type: "image",
    key: key.replace(/(\.\.\/image\/role\/|\.png)/g, ""),
    url: module.default,
  }));
} else {
  const context = require.context("../image/role/", true, /.png$/);
  levelModules = context.keys().map((file) => {
    return {
      type: "image",
      key: file.replace(/[\.]?\//g, "").replace(".png", ""),
      url: require("../image/role/" + file.replace("./", "")),
    };
  });
}

export default levelModules;
