/**
 * @flie 关卡显示面板
 */
interface Param {
  scene: Phaser.Scene;
  texture: string;
  level: number;
  x?: number;
  y?: number;
  depth?: number;
}
export default class LevelPanel extends Phaser.GameObjects.Container {
  param: Param;
  constructor(param: Param) {
    super(param.scene);
    const bg = param.scene.add.image(0, 0, param.texture).setOrigin(0, 0);
    const level = param.scene.add
      .text((bg.width - 110) / 2, 17, param.level.toString().padStart(2, "0"), {
        fontFamily: "PuHuiTi",
        fontSize: "48px",
        color: "#FEF6EF",
        align: "center",
        fontStyle: "bold",
        fixedWidth: 120,
        fixedHeight: 65,
        // backgroundColor: "rgba(0,0,0,0.3)",
        baselineY: 2.17,
      })
      .setOrigin(0, 0);
    this.add([bg, level]);
    param.scene.add.existing(this);
    this.setSize(bg.width, bg.height);
    param.depth && this.setDepth(param.depth);
    this.setPosition(
      param.x || (+param.scene.game.config.width - bg.width) / 2,
      param.y || 0
    );
  }
}
