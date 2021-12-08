/**
 * 图鉴入口
 */
export default class CollectMap extends Phaser.GameObjects.Container {
  constructor(param: ContainerParams) {
    super(param.scene, param.x, param.y)
    const icon = param.scene.add.image(0, 0, 'main_collect_map').setOrigin(0, 0)
    this.width = 260
    this.height = icon.height;
    const g = param.scene.add.graphics({
      fillStyle: { color: 0x0F2A6C, alpha: 0.25 }
    });
    const textBg = g.fillRoundedRect(20, (icon.height - 88) / 2, this.width, 88, 44);
    const countText = param.scene.add
      .text(
        icon.width, icon.height / 2,
        "搜索图鉴",
        {
          fontFamily: "PuHuiTi",
          fontSize: "32px",
          color: "#FFFFE0",
          align: "center",
          fontStyle: "bold",
          fixedWidth: 250 - icon.width + 20,
          // fixedHeight: 62,
          // backgroundColor: "rgba(0,0,0,0.3)",
        }
      )
      .setOrigin(0, 0.5)
    const zone = param.scene.add.zone(0, 0, this.width, this.height)
      .setOrigin(0, 0)
      .setInteractive()
      .on('pointerdown', (_, _2, _3, event) => event.stopPropagation())
      .on('pointerup', () => {
        param.scene.musicManager.play("click");
        // todo
        console.log('进入图鉴')
      })
      .setScrollFactor(0)


    this.add([textBg, icon, countText, zone])
    param.scene.add.existing(this);
  }
}