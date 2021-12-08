/**
 * 移出vite中的import.meta. ,避免webpack编译错误
 */
function loader(source, map) {
  return source.replace("import.meta.","");
}
module.exports = loader;