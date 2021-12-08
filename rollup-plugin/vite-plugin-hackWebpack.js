/**
 * 替换webpack存在的全局变量process.env，避免vite编译错误
 */
const fileRegex = /\.(ts)$/;
module.exports = function loadCsv() {
    return {
        name: 'vite-plugin-hackWebpack',
        transform(code, id, ssr) {
            if (fileRegex.test(id)) {
                return {
                    code: code.replace("process.env.","window."),
                    map: null
                }
            }
        }
    }
}