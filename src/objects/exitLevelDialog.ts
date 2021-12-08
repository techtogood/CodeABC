/**
 * @file 退出关卡的弹框
 */
interface Param {
  scene: Phaser.Scene;
  level: number;
  onExit?: () => void;
  onCancel?: () => void;
}
export default class ExitLevelDialog extends Phaser.GameObjects.Container {
  depth = 1000;
  alpha=0;
  constructor(param: Param) {
    super(param.scene, 0, 0);
    const config = param.scene.game.config;
    // 创建黑色半透明背景
    const graphics = param.scene.add.graphics();
    graphics
      .fillStyle(0x0d0d0c, 0.7)
      .fillRect(0, 0, +config.width, +config.height)
      .setDepth(10)
      .setScrollFactor(0)
      .setInteractive(
        new Phaser.Geom.Rectangle(0, 0, +config.width, +config.height),
        Phaser.Geom.Rectangle.Contains
      )
      .on("pointerdown", (pointer, localX, localY, e) => e.stopPropagation())
      .on("pointerup", (pointer, localX, localY, e) => e.stopPropagation());
    const centerX = +config.width / 2;
    // 标题背景
    const titleBg = param.scene.add
      .image(centerX, 227, "dialog_title_bg")
      .setOrigin(0.5, 0);
    // 标题
    const title = param.scene.add
      .text(titleBg.x, titleBg.y, `退出关卡${param.level}`, {
        fontSize: "60px",
        fontFamily: "PuHuiTi",
        fontStyle: "800",
        color: "#FEFFE4",
        // backgroundColor: "rgba(255,0,0,.4)",
        shadow: {
          offsetY: 4,
          color: "#DE6F19",
        },
        align: "center",
        fixedWidth: titleBg.width,
        // fixedHeight: titleBg.height,
      })
      .setOrigin(0.5, 0);
    title.setY(titleBg.y + (titleBg.height - title.height) / 2);
    // 内容背景
    const dialogContentBg = param.scene.add
      .image(centerX, 281, "dialog_content_bg")
      .setOrigin(0.5, 0);
    const dialogContentBgTopLeft = dialogContentBg.getTopLeft();
    // 内容
    const content = param.scene.make
      .text({
        text: "退出关卡将无法获得本关奖励，是否退出？",
        x: centerX,
        y: dialogContentBgTopLeft.y + 137,
        origin: { x: 0.5, y: 0.5 },
        style: {
          fontSize: "40px",
          fontFamily: "PuHuiTi",
          // fontWeight: 500,
          fontStyle: "500",
          // fill: "#FFCB9C"
          color: "#FFCB9C",
          align: "left",
          wordWrap: { width: 446, useAdvancedWrap: true },
          // backgroundColor: "rgba(255,0,0,.4)",
        },
      })
      .setOrigin(0.5, 0);
    // 退出按钮
    const exitBtn = param.scene.add
      .image(centerX, dialogContentBgTopLeft.y + 288, "exit_btn")
      .setOrigin(0.5, 0)
      .setScrollFactor(0)
      .setInteractive()
      .on("pointerup", (pointer, localX, localY, event) => {
        this.scene.musicManager.play("click");
        this.destroy();
        graphics.destroy();
        param.onExit && param.onExit();
        event.stopPropagation();
      });
    // 取消按钮
    const cancelBtn = param.scene.add
      .image(centerX, dialogContentBgTopLeft.y + 418, "cancel_btn")
      .setOrigin(0.5, 0)
      .setScrollFactor(0)
      .setInteractive()
      .on("pointerup", (pointer, localX, localY, event) => {
        this.scene.musicManager.play("click");
        this.destroy();
        graphics.destroy();
        param.onCancel && param.onCancel();
        event.stopPropagation();
      });
    // 添加到容器
    this.add([
      graphics,
      dialogContentBg,
      titleBg,
      title,
      content,
      exitBtn,
      cancelBtn,
    ]);
    this.setScrollFactor(0);
    this.width = +config.width;
    this.height = +config.height;
    param.scene.add.existing(this);
    this.setDepth(1000);
    this.scene.add.tween({
      targets: this,
      alpha: 1,
      duration: 500,
    });
  }
}
