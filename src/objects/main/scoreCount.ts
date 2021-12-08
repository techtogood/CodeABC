type Param = {
  count: number;
} & ContainerParams;
export default class ScoreCount extends Phaser.GameObjects.Container {
  constructor(param: Param) {
    super(param.scene, param.x, param.y)
    const icon = param.scene.add.image(0, 0, 'main_my_star').setOrigin(0, 0)
    this.width = 250
    this.height = icon.height;
    const g = param.scene.add.graphics({
      fillStyle: { color: 0x0F2A6C, alpha: 0.25 }
    });
    const textBg = g.fillRoundedRect(0, (icon.height - 88) / 2, this.width, 88, 44);
    const countText = param.scene.add
      .text(
        icon.width, icon.height / 2,
        param.count.toString().padStart(3, '0'),
        {
          fontFamily: "PuHuiTi",
          fontSize: "40px",
          color: "#FFFFE0",
          align: "center",
          fontStyle: "bold",
          fixedWidth: this.width - icon.width - 25,
          // fixedHeight: 62,
          // backgroundColor: "rgba(0,0,0,0.3)",
        }
      )
      .setOrigin(0, 0.5)
    this.add([textBg, icon, countText])

    param.scene.add.existing(this);
  }
}