/**
 * 加载所有的角色
 */

//加载该路径下的所有文件
const modulesObj = {};
if (process.env.BUILDTOOLS !== "webpack") {
  const context = import.meta.globEager("./*.ts");
  Object.entries(context).forEach(([key, module]) => {
    if (~key.indexOf("baseRole")) return;
    modulesObj[module.default.roleType] = module.default;
  });
} else {
  const context = require.context("./", true, /.ts$/);
  const modules = context
    .keys()
    .filter((file) => file.indexOf("index") < 0 && file.indexOf("baseRole") < 0)
    .map((file) => {
      return require(file + "").default;
    });
  modules.forEach((item: any) => {
    modulesObj[item.roleType] = item;
  });
}

export default modulesObj;
