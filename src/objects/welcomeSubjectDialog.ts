/**
 * @file 进入主题的欢迎弹框
 */
interface Param {
  scene: Phaser.Scene;
  subject: number;
}
const StorageKey = "already_show_welcome_dialog_list";
export default class WelcomeSubjectDialog extends Phaser.GameObjects.Container {
  alpha = 0;
  constructor(param: Param) {
    super(param.scene, 0, 0);
    const alreadyShowWelcomeDialogList = JSON.parse(
      window.localStorage.getItem(StorageKey) || "[]"
    );
    if (alreadyShowWelcomeDialogList.includes(param.subject)) {
      this.destroy();
    } else {
      const config = param.scene.game.config;
      // 创建黑色半透明背景
      const graphics = param.scene.add
        .graphics()
        .fillStyle(0x0d0d0c, 0.7)
        .fillRect(0, 0, +config.width, +config.height)
        .setDepth(10)
        .setScrollFactor(0)
        .setInteractive(
          new Phaser.Geom.Rectangle(0, 0, +config.width, +config.height),
          Phaser.Geom.Rectangle.Contains
        )
        .on("pointerdown", (pointer, localX, localY, e) => e.stopPropagation())
        .on("pointerup", (pointer, localX, localY, e) => e.stopPropagation())
        .on("pointermove", (pointer, localX, localY, e) => e.stopPropagation());
      const centerX = +config.width / 2;
      // 标题背景
      const content = param.scene.add
        .image(centerX, 181, `welcome_dailog_${param.subject}`)
        .setOrigin(0.5, 0);
      // 开始按钮
      const startBtn = param.scene.add
        .image(centerX, 836, "start_btn")
        .setInteractive()
        .setScrollFactor(0)
        .on("pointerup", (pointer, localX, localY, event) => {
          this.scene.musicManager.play("click");
          alreadyShowWelcomeDialogList.push(param.subject);
          this.destroy();
          window.localStorage.setItem(
            StorageKey,
            JSON.stringify(alreadyShowWelcomeDialogList)
          );
          event.stopPropagation();
        })
        .setOrigin(0.5, 0);
      // 添加到容器
      this.add([graphics, content, startBtn]);
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
}
