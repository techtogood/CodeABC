//加载该路径下的所有文件
let levelModules;
if (process.env.BUILDTOOLS !== "webpack") {
  const context = import.meta.globEager("../image/blockly/**/*.png");
  levelModules = Object.entries(context).map(([key, module]) => ({
    type: "image",
    key: key.replace(/(\.\.\/image\/|\.png)/g, "").replace(/\//g, "_"),
    url: module.default,
  }));
} else {
  const context = require.context("../image/blockly/", true, /.png$/);
  levelModules = context.keys().map((file) => {
    return {
      type: "image",
      key: "blockly" + file.replace(/[\.]?\//g, "_").replace(".png", ""),
      url: require("../image/blockly/" + file.replace("./", "")),
    };
  });
}

export default levelModules;
