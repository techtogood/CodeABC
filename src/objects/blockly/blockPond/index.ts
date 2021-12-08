//加载该路径下的所有文件
const modulesObj = {};

if (process.env.BUILDTOOLS !== "webpack") {
  const context = import.meta.globEager("./*.ts");
  Object.entries(context).forEach(([key, module]) => {
    if (~key.indexOf("baseBlockPond")) return;
    modulesObj[`theme_${key.replace(/\.\/|\.ts/g, "")}`] = module.default;
  });
} else {
  const context = require.context("./", true, /.ts$/);
  const modules = context
    .keys()
    .filter(
      (file) => file.indexOf("index") < 0 && file.indexOf("baseBlockPond") < 0
    )
    .map((file) => {
      return require(file + "").default;
    });
  modules.forEach((item: any, index) => {
    modulesObj[`theme_${index + 1}`] = item;
  });
}
export default modulesObj;
