//加载该路径下的所有文件
const modulesObj: {
  [key: string]: Blockly.BaseBlock;
} = {};
if (process.env.BUILDTOOLS !== "webpack") {
  const context = import.meta.globEager("./*.ts");
  Object.entries(context).forEach(([key, module]) => {
    if (~key.indexOf("baseBlock")) return;
    modulesObj[module.default.blockName] = module.default;
  });
} else {
  const context = require.context("./", true, /.ts$/);
  const modules = context
    .keys()
    .filter(
      (file) => file.indexOf("index") < 0 && file.indexOf("baseBlock") < 0
    )
    .map((file) => {
      return require(file + "").default;
    });
  modules.forEach((item: any) => {
    modulesObj[item.blockName] = item;
  });
}
export default modulesObj;
