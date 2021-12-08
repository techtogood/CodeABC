import MainConfig from "@/config/main";
import BootScene from "./boot-scene";
import basePack from "@/assets/packs/base-pack";
import blocklyFiles from "@/assets/packs/blockly-files";
import SubjectEntry from '@/objects/main/subjectEntry';
import UserInfo from '@/objects/main/userInfo';
import ScoreCount from '@/objects/main/scoreCount';
import CollectMap from '@/objects/main/collectMap';
import ParentsCenter from '@/objects/main/parentsCenter';
import Ball from '@/objects/main/ball';
const TotalScoreStorageKey = "totalScore";
export default class MainScene extends BootScene {
  constructor() {
    super("MainScene");
  }
  init() {
    super.init({
      packJson: {
        preload: {
          files: [...basePack.preload.files, ...blocklyFiles],
        },
      },
    });
  }
  create() {
    console.log(this.scene.key);
    this.initScene();
    this.musicManager.playBgm("bgm_1");
    this.loadFont();
    // debug--------
    const level = 0;
    level > 0 &&
      this.router.push(MainConfig.subjects[level - 1].sceneKey, {
        packJson: MainConfig.subjects[level - 1].packJson,
      });
    //---------------
  }
  initScene() {
    const width = +this.game.config.width;
    const height = +this.game.config.height;
    const center = { x: width / 2, y: height / 2 };
    this.add.image(width / 2, height / 2, "main_bg").setScrollFactor(0);
    (
      [
        // { x: 1036, y: 549, x2: 1128.5, y2: 540 },
        // { x: 768, y: 459, x2: 777.5, y2: 491.5 },
        // { x: 242, y: 525, x2: 245.5, y2: 521.5 },
        // { x: 160, y: 487, x2: 153, y2: 487.5 },
        { x: 711, y: 429.5, x2: 711, y2: 429.5, scale: 0.91, scale2: 0.7, duration: 1530, delay: 0 },
        { x: -998, y: 306.5, x2: -998, y2: 306.5, scale: 0.62, scale2: 0.54, duration: 1530, delay: 0 },
        { x: 294, y: 399.5, x2: 314, y2: 379.5, scale: 0.31, scale2: 0.269, duration: 1530, delay: 0 },
        { x: -804, y: 415.5, x2: -794, y2: 405.5, scale: 0.196, scale2: 0.196, duration: 1530, delay: 0 },
      ]
    ).map(item => new Ball({ ...item, scene: this, x: item.x + center.x, y: item.y + center.y, x2: item.x2 + center.x, y2: item.y2 + center.y, }).setScrollFactor(0));
    new SubjectEntry({
      scene: this,
      x: 0,
      y: 0,
    });
    this.add.image(width - 72 - 124, 40, 'main_setting').setInteractive().on('pointerup', () => {
      this.musicManager.play("click");
      // todo
      console.log('设置')
    }).setOrigin(0, 0).setScrollFactor(0);
    new ParentsCenter({
      scene: this,
      x: width - 476,
      y: 37
    }).setScrollFactor(0);
    new CollectMap({
      scene: this,
      x: width - 831,
      y: 44,
    }).setScrollFactor(0);

    const score = window.localStorage.getItem(TotalScoreStorageKey) || "0";
    new ScoreCount({
      scene: this,
      x: width - 1146,
      y: 43,
      count: +score,
    }).setScrollFactor(0);


    new UserInfo({
      scene: this,
      x: 118,
      y: 29,
      text: "橙狮"
    }).setScrollFactor(0);
  }
  /**
   * 加载第三方字体
   */
  private loadFont() {
    window.WebFont.load({
      custom: {
        families: ["PuHuiTi"],
      },
      active: function () { },
    });
  }
}
