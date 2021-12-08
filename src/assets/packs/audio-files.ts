//加载该路径下的所有文件
let levelModules;
if (process.env.BUILDTOOLS !== "webpack") {
  const context = import.meta.globEager("../audio/*.*");
  levelModules = Object.entries(context).map(([key, module]) => ({
    type: "audio",
    key: key.replace(/(\.\.\/audio\/|\.mp3|\.wav)/g, ""),
    url: module.default,
  }));
} else {
  const context = require.context("../audio/", true, /.(mp3|wav)$/);
  levelModules = context.keys().map((file) => {
    return {
      type: "audio",
      key: file.replace(/[\.]?\//g, "").replace(/.(mp3|wav)/, ""),
      url: require("../audio/" + file.replace("./", "")),
    };
  });
}
export default levelModules;
