/**
 * @file 通用弹框
 */
interface Param {
  scene: Phaser.Scene;
  title: string;
  content: string;
  onOk?: () => void;
}
export default class Dialog extends Phaser.GameObjects.Container {
  depth = 1000;
  constructor(param: Param) {
    super(param.scene, 0, 0);
    const config = param.scene.game.config;
    // 开始按钮
    const start_btn = param.scene.add
      .image(+config.width / 2, 688, "start_btn")
      .setOrigin(0.5, 0);
    start_btn.setInteractive();
    start_btn.on("pointerup", (pointer, localX, localY, event) => {
      this.scene.musicManager.play("click");
      this.destroy();
      graphics.destroy();
      param.onOk && param.onOk();
      event.stopPropagation();
    });
    // 创建黑色半透明背景
    const graphics = param.scene.add.graphics();
    graphics
      .fillStyle(0x0d0d0c, 0.7)
      .fillRect(0, 0, +config.width, +config.height)
      .setDepth(10)
      .setScrollFactor(0);
    // 标题
    const title = param.scene.add
      .text(+config.width / 2, 251, param.title, {
        fontSize: "60px",
        fontFamily: "PuHuiTi",
        fontStyle: "800",
        // fontWeight: ,
        color: "#FEFFE4",
        shadow: {
          offsetY: 4,
          color: "#DE6F19",
        },
        // textShadow: "0px 4px 0px #DE6F19",
      })
      .setOrigin(0.5, 0);
    title.setY(title.y + title.height / 2);
    // 内容
    const content = param.scene.make.text({
      text: param.content,
      x: +config.width / 2,
      y: +config.height / 2,
      origin: { x: 0.5, y: 0.5 },
      style: {
        fontSize: "40px",
        fontFamily: "PuHuiTi",
        // fontWeight: 500,
        fontStyle: "500",
        // fill: "#FFCB9C"
        color:"#FFCB9C",
        align: "center",
        wordWrap: { width: 480, useAdvancedWrap: true },
      },
    });
    content.setY(content.y);
    // 添加到容器
    this.add([
      graphics,
      param.scene.add
        .image(+config.width / 2, 295, "dialog_content_bg")
        .setOrigin(0.5, 0),
      param.scene.add
        .image(+config.width / 2, 251, "dialog_title_bg")
        .setOrigin(0.5, 0),
      title,
      content,
      start_btn,
    ]);
    this.setScrollFactor(0);
    this.width = +config.width;
    this.height = +config.height;
    param.scene.add.existing(this);
    this.setDepth(1000);
  }
}
