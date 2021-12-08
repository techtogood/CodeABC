import "phaser";
import MainScene from "./scenes/main-scene";
import subject_1_SceneList from "./subject_1/scenes/index";
import MusicManager from "@/plugins/musicManager";
import Router from "@/plugins/router";
// import vconsole from 'vconsole'
// import Font from "./assets/fonts/Alibaba-PuHuiTi-Bold.ttf";
// var element = document.createElement("style");
// document.head.appendChild(element);
// var sheet:any  = element.sheet;
// console.log(Font)
// var styles =
//   '@font-face { font-family: "troika"; src: url("' +
//   Font +
//   '") format("opentype"); }\n';
// sheet.insertRule(styles, 0);
/**
 * 注意这里的宽高计算是横屏的
 */
// new vconsole();
const BaseHeight = 1125; //横屏的高度
const BaseWidth = 2436; //横屏的宽度
const width =
  (BaseHeight / document.documentElement.clientHeight) *
  document.documentElement.clientWidth; //等比放大documentElement的高度到BaseWidth的值，再计算放大后的宽度（横屏的宽度）
const zoom = document.documentElement.clientHeight / BaseHeight;
window.offect = {
  left: (BaseWidth - width) / 2,
  right: (BaseWidth - width) / 2,
};
const DEFAULT_CONFIG: Phaser.Types.Core.GameConfig = {
  version: "1.0",
  width,
  height: BaseHeight,
  zoom: zoom,
  type: Phaser.AUTO,
  parent: "game",
  scene: [
    MainScene,
    ...subject_1_SceneList,
  ],
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      // debug: true,
    },
  },
  // transparent: true,
  backgroundColor: "#fff",
  render: { pixelArt: false, antialias: true },
  dom: {
    createContainer: true, // v3.5+需要false，否则影响事件的监听，原因未道
  },
  disableContextMenu: true,
  plugins: {
    global: [
      {
        key: "musicManager",
        mapping: "musicManager", //合并到scene的字段
        plugin: MusicManager,
        start: true,
      },
      {
        key: "router",
        mapping: "router",
        plugin: Router,
        start: true,
        data: {// 初始化插件使用
          path: "MainScene",
        },
      },
    ],
  },
  input: {
    keyboard: true,
    activePointers: 1,
  },
  // autoFocus: true,
  // audio:{
  //   disableWebAudio:true
  // }
};

export class Game extends Phaser.Game {
  constructor(config: Phaser.Types.Core.GameConfig) {
    super(Object.assign({}, DEFAULT_CONFIG, config));
    this.sound.pauseOnBlur = false;
  }
}
// interface TouchEndEvent extends Event {
//   changedTouches?: [];
// }
window.addEventListener("load", () => {
  var game = new Game({});
  // const event: TouchEndEvent = document.createEvent("Events");
  // event.initEvent("touchend", true, false);
  // event.changedTouches = []; //phaser.js里使用到了这个属性
  // document.body.dispatchEvent(event);
});
