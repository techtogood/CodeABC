/**
 * @file 关卡入口场景底图，以及装饰物
 */
 export default class BaseEntryMap extends Phaser.GameObjects.Container {
  constructor(param: {
    scene: Phaser.Scene;
    x: number;
    y: number;
    mapTiles: Game.MapTiles[];
  }) {
    const list: Array<Phaser.GameObjects.Image> = [];
    // 横向连接所有地图块
    param.mapTiles.forEach((item, index) => {
      let x = 0;
      if (index > 0) {
        x = list[index - 1].x + list[index - 1].width;
      }
      list.push(param.scene.add.image(x, 0, item.key).setOrigin(0, 0));
      item.decoration.forEach((item2) => {
        param.scene.add
          .image(item2.x, item2.y, item2.key)
          .setDepth(item2.depth)
          .setOrigin(0, 0);
      });
    });
    super(param.scene, 0, 0, list);
    this.height = +this.scene.game.config.height;
    this.width = list[list.length - 1].x + list[list.length - 1].width;
    param.scene.add.existing(this);
  }
}
