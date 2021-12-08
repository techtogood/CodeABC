/**
 * @flie 游戏中奖励结算
 */
interface Param {
  scene: Phaser.Scene;
}
export default class GameOverDialog extends Phaser.GameObjects.Container {
  param: Param;
  depth = 1000;
  alpha = 0;
  constructor(param: Param) {
    super(param.scene, 0, 0, []);
    this.scene.musicManager.pauseBgm();
    this.scene.musicManager.play("fail");
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
    const gameOverContent = param.scene.add
      .image(+config.width / 2, 218, "game_over_dailog")
      .setOrigin(0.5, 0);
    const gameOverContentTopLeft = gameOverContent.getBottomLeft();

    // 首页 按钮
    const homelBtn = param.scene.add
      .image(
        gameOverContentTopLeft.x + 64,
        gameOverContentTopLeft.y + 50,
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
    // 重新开始 按钮
    const restartBtn = param.scene.add
      .image(
        gameOverContentTopLeft.x + 215,
        gameOverContentTopLeft.y + 50,
        "restart_btn"
      )
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setInteractive()
      .on("pointerup", async (pointer, localX, localY, e) => {
        this.scene.musicManager.play("click");
        this.scene.musicManager.resumeBgm();
        this.scene.scene.restart();
        this.destroy();
      });
    this.add([graphics, gameOverContent, restartBtn, homelBtn]);
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
