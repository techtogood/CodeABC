/**
 * @file 主题关卡入口的父类，接受子类实例化时传递的某个主题的全部关卡入口及关卡配置，点击关卡入口时，传递游戏配置到场景中
 */
import BackBtn from "@/objects/backBtn";
import BootScene from "./boot-scene";
import BaseEntryMap from "@/objects/baseEntryMap";
import welcomeSubjectDialog from "@/objects/welcomeSubjectDialog";
type Param = {
  key: string;
  subjectConfig: Game.SubjectConfig;
};
export default class BaseEntryScene extends BootScene {
  protected map: BaseEntryMap;
  protected param: Param;
  constructor(param: Param) {
    super(param.key);
    this.param = param;
  }

  create() {
    console.log(this.scene.key);
    this.input.topOnly = true;
    // 滚到到指定位置（进入关卡前的位置）
    this.cameras.main.setScroll(
      +(window.localStorage.getItem(`${this.scene.key}_scrollX`) || 0),
      0
    );
    // 创建地图及其装饰物
    const map = new BaseEntryMap({
      scene: this,
      x: 0,
      y: 0,
      mapTiles: this.param.subjectConfig.mapTiles,
    });
    this.map = map;
    //设置边界
    this.cameras.main.setBounds(0, 0, map.width, +this.game.config.height);
    // 左上角的返回按钮
    new BackBtn({
      scene: this,
      pointerup: () => {
        window.localStorage.setItem(
          `${this.scene.key}_scrollX`,
          this.cameras.main.scrollX.toString()
        );
        this.router.back();
      },
    });
    // 欢迎弹框
    new welcomeSubjectDialog({
      scene: this,
      subject: this.param.subjectConfig.subject,
    });
    this.createLevelEntry();
    this.createMapScroll();
  }
  /**
   * 滚动cameras，并模拟惯性滚动
   */
  createMapScroll() {
    let pointerdownX = 0; //前一个滑动的点
    let pointerdownTime = 0; //前一个滑动的点
    let moveLength = 0; //滑动的距离
    let pointermovePrevX = 0; // 上一个pointermove的点
    let pointermoveLastSpeed = 0; //最后pointermove的速度（单位：像素/每毫米）
    let pointermovePrevTime = 0; //上一个pointermove的时间戳
    let isDown = false;
    this.input.on(
      "pointerdown",
      (pointer, currentlyOver) => {
        pointerdownX = pointer.x;
        pointerdownTime = Date.now();
        pointermovePrevX = pointer.x;
        pointermovePrevTime = Date.now();
        scrollTween && scrollTween.pause();
        isDown = true;
      },
      this
    );
    this.input.on(
      "pointermove",
      (pointer, currentlyOver) => {
        if (isDown) {
          this.cameras.main.scrollX -=
            pointer.position.x - pointer.prevPosition.x;
          pointermoveLastSpeed =
            (pointer.x - pointermovePrevX) / (Date.now() - pointermovePrevTime);
          pointermovePrevTime = Date.now();
          pointermovePrevX = pointer.x;
        }
      },
      this
    );
    let scrollTween: Phaser.Tweens.Tween;
    this.input.on(
      "pointerup",
      (pointer: Phaser.Input.Pointer, currentlyOver) => {
        if (isDown) {
          isDown = false;
          moveLength = pointer.x - pointerdownX;
          if (Math.abs(moveLength) > 3 && Math.abs(pointermoveLastSpeed) > 1) {
            // 模拟惯性滚动
            const time = Math.max(Date.now() - pointerdownTime, 1);
            let speed = Math.abs(moveLength) / time; //单位：像素/毫秒
            speed = speed * 40;
            let duration = Math.floor(speed * 25);
            const target = { x: speed };
            scrollTween && scrollTween.pause();
            scrollTween = this.add.tween({
              targets: target,
              x: 0,
              ease: "Quart.easeOut",
              duration,
              onUpdate: () => {
                this.cameras.main.scrollX +=
                  Math.floor(target.x * 1) *
                  (Math.abs(moveLength) / -moveLength);
              },
            });
          }
        }
      },
      this
    );
  }
  /**
   * 创建关卡入口
   */
  createLevelEntry() {
    const zoneArray = this.param.subjectConfig.levelEntryConfigs.map(
      (entry) => {
        const entryImage = this.add.image(entry.x, entry.y, entry.key);
        entryImage.x += entryImage.width / 2;
        entryImage.y += entryImage.height / 2;
        !entry.open && entryImage.setAlpha(0.5);
        this.game.registry.set(
          "level_configs",
          this.param.subjectConfig.levelConfigs
        );
        return this.add
          .zone(
            entryImage.x,
            entryImage.y,
            entryImage.width * 1.5,
            entryImage.height * 1.5
          )
          .setInteractive()
          .setData(
            "level_config",
            this.param.subjectConfig.levelConfigs[entry.level - 1]
          )
          .setData("isOpen", entry.open);
      }
    );
    const group = this.add.group(zoneArray);
    // 自定义点击事件
    let clickTarget = null; //被点击的元素
    this.input.on("gameobjectdown", (pointer, gameObject, event) => {
      if (group.contains(gameObject)) {
        clickTarget = gameObject;
      }
    });
    this.input.on(
      "gameobjectup",
      (pointer: Phaser.Input.Pointer, gameObject, event) => {
        if (
          clickTarget === gameObject &&
          group.contains(gameObject) &&
          pointer.getDistanceY() < 1 // 滑动距离小于1px
        ) {
          const levelConfig = gameObject.getData("level_config");
          const isOpen = gameObject.getData("isOpen");
          if (levelConfig && isOpen) {
            this.musicManager.play("click");
            window.localStorage.setItem(
              `${this.scene.key}_scrollX`,
              this.cameras.main.scrollX.toString()
            );
            this.router.push(levelConfig.sceneKey, {
              levelConfig,
            });
            // this.scene.transition({
            //   target: gameObject.getData("scene"),
            //   duration: 2000,
            //   moveBelow: true,
            //   onUpdate: (progress:number) => {
            //     console.log(progress)
            //     // this.map.y = 600 * progress;
            //   },
            // });
          } else {
            this.musicManager.play("mistake");
          }
          clickTarget = null;
        }
      }
    );
  }
}
