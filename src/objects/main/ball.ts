/**
 * 在两点位置来回运动的球
 */
type Param = {
  scale: number;
  scale2: number;
  duration?: number;
  delay?: number;
  x2: number;
  y2: number;
} & ContainerParams;
export default class Ball extends Phaser.GameObjects.Image {
  constructor(param: Param) {
    super(param.scene, param.x, param.y, 'main_ball');
    this.setScale(param.scale).setOrigin(0, 0)
    param.scene.add.tween({
      targets: this,
      x: param.x2,
      y: param.y2,
      scale: param.scale2,
      yoyo: true,
      loop: -1,
      duration: param.duration !== undefined ? param.duration : Phaser.Math.Between(4000, 10000),
      delay: param.delay !== undefined ? param.delay : Phaser.Math.Between(0, 3000)
    })
    param.scene.add.existing(this);
  }
}