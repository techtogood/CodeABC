/**
 * @flie 返回按钮 ，不会随camera滚动
 */
interface Param {
  scene: Phaser.Scene;
  pointerup: () => void;
  x?: number;
  y?: number;
  depth?: number;
}
export default class BackBtn extends Phaser.GameObjects.Image {
  param: Param;
  constructor(param: Param) {
    super(param.scene, param.x || 107, param.y || 27, "back_btn");
    this.param = param;
    this.setOrigin(0, 0)
      .setDepth(param.depth || 999)
      .setScrollFactor(0);
    param.scene.add.existing(this);
    this.bindEvent();
  }
  private bindEvent() {
    this.setInteractive();
    this.on("pointerup", (pointer, localX, localY, event) => {
      this.param.pointerup();
      this.param.scene.musicManager.play("click");
      event.stopPropagation();
    });
  }
}
