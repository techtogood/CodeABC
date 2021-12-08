/**
 * @flie 游戏中奖励结算
 */
interface Param {
  scene: Phaser.Scene;
  goldCount: Number;//获得的奖励
  nextLevelConfig?: Game.LevelConfigs; //下一个关卡的关卡配置，若为主题中的最后一个关卡，则为undefined
}
export default class RewardDialog extends Phaser.GameObjects.Container {
  param: Param;
  depth = 1000;
  alpha = 0;
  constructor(param: Param) {
    super(param.scene, 0, 0, []);
    this.scene.musicManager.pauseBgm();
    this.scene.musicManager.play("victory");
    const config = param.scene.game.config;
    // 使用graphics创建遮罩
    const graphics = param.scene.add
      .graphics()
      .fillStyle(0x000000, 0.6)
      .fillRect(0, 0, +config.width, +config.height)
      .setInteractive(
        new Phaser.Geom.Rectangle(0, 0, +config.width, +config.height),
        Phaser.Geom.Rectangle.Contains
      )
      .on("pointerdown", (pointer, localX, localY, e) => e.stopPropagation())
      .on("pointerup", (pointer, localX, localY, e) => e.stopPropagation());
    // 标题
    const rewardTitle = param.scene.add
      .image(+config.width / 2, 142, "reward_title")
      .setOrigin(0.5, 0);
    const rewardTitleTopLeft = rewardTitle.getBottomLeft();
    // 中间内容区域
    const rewardGoldContainer = param.scene.add.container(
      rewardTitleTopLeft.x - 18,
      rewardTitleTopLeft.y - 166,
      [
        param.scene.add.image(0, 0, "reward_count_bg").setOrigin(0, 0),
        param.scene.add.image(240, 240, "reward_gold").setOrigin(0, 0),
        param.scene.add
          .text(244, 320, "+" + param.goldCount.toString(), {
            fontSize: "54px",
            color: "#FEF6EF",
            align: "center",
            // backgroundColor:'rgba(255,0,0,.3)',
            fontStyle: "bold",
            fixedWidth: 134,
            fixedHeight: 52,
          })
          .setOrigin(0, 0),
      ]
    );
    // 首页 按钮
    const homelBtn = param.scene.add
      .image(
        rewardTitleTopLeft.x + (param.nextLevelConfig ? 67 : 229),
        rewardTitleTopLeft.y + 319,
        "home_btn"
      )
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setInteractive()
      .on("pointerup", (pointer, localX, localY, e) => {
        this.scene.musicManager.play("click");
        this.scene.musicManager.resumeBgm();
        this.scene.router.home();
      });
    // 下一关 按钮
    const nextLevelBtn = param.scene.add
      .image(
        rewardTitleTopLeft.x + 213,
        rewardTitleTopLeft.y + 320,
        "next_level_btn"
      )
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setInteractive()
      .on("pointerup", async (pointer, localX, localY, e) => {
        this.scene.musicManager.play("click");
        this.scene.musicManager.resumeBgm();
        this.scene.router.redirect(param.nextLevelConfig.sceneKey, {
          levelConfig: param.nextLevelConfig,
        });
        this.destroy();
      })
      .setVisible(!!param.nextLevelConfig);
    this.add([
      graphics,
      rewardTitle,
      rewardGoldContainer,
      nextLevelBtn,
      homelBtn,
    ]);
    this.width = +config.width;
    this.height = +config.height;
    param.scene.add.existing(this);
    this.scene.add.tween({
      targets: this,
      alpha: 1,
      duration: 500,
    });
  }
}
