
/**
 * @type {import('vite').UserConfig}
 */
//  import legacy from '@vitejs/plugin-legacy'
var path = require('path');
import tsconfigPaths from 'vite-tsconfig-paths';
import loadCsv from 'rollup-plugin-csv';
import hackWebpack from './rollup-plugin/vite-plugin-hackWebpack';
const config = {
  base: './',//构建后的资源引入路径，默认是'/'
  resolve: {
    alias: {
      '@': path.resolve(__dirname, "src"),
    }
  },
  build: {
    target: 'es2015',
    assetsInlineLimit: 0,//phaser 不能加载base64
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        strategy: path.resolve(__dirname, 'strategy/index.html')
      }
    }
    // rollupOptions: {
    //   // 请确保外部化那些你的库中不需要的依赖
    //   external: ['Phaser'],
    //   output: {
    //     // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
    //     globals: {
    //       Phaser: 'phaser'
    //     }
    //   }
    // }
  },
  json: {
    stringify: true,
  },
  server: {
    host: "0.0.0.0",
    port: 8000
  },
  plugins: [
    hackWebpack(),
    tsconfigPaths(),
    loadCsv(),
    // legacy({
    //   targets: ['ie 11'],
    //   additionalLegacyPolyfills: ['regenerator-runtime/runtime']
    // }),
  ],
  hmr: {
    overlay: false
  },
  assetsInclude: ['png', 'mp3', 'wav', 'json'] //因为是通过 import.meta.globEager加载，被插件转换管道排除在外了，需要手动声明（https://cn.vitejs.dev/config/#assetsinclude）
}

export default config