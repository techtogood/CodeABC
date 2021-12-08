/**
 * 加载所有的tiles
 */
const modulesObj: {
  [key: string]: Tiles.BaseTiles;
} = {};
if (process.env.BUILDTOOLS !== "webpack") {
  const context = import.meta.globEager("./*.ts");
  Object.entries(context).forEach(([key, module]) => {
    if (~key.indexOf("baseTiles")) return;
    modulesObj[module.default.tileType] = module.default;
  });
} else {
  const context = require.context("./", true, /.ts$/);
  const modules = context
    .keys()
    .filter(
      (file) => file.indexOf("index") < 0 && file.indexOf("baseTiles") < 0
    )
    .map((file) => {
      return require(file + "").default;
    });
  modules.forEach((item: any) => {
    modulesObj[item.tileType] = item;
  });
}
export default modulesObj;
