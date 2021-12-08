import { colliderTypeEnum } from "@/enum";
import { createId } from "@/utils";
type Param = {
  width?: number;
  height?: number;
} & ContainerParams;
export default abstract class BaseTiles extends Phaser.GameObjects.Container {
  readonly id = createId();
  static tileType = "";
  static textureKeyPrefix = ""; // 纹理前缀
  static colliderType: colliderTypeEnum = colliderTypeEnum.none;
  width = 102;
  height = 102;
  private __proto__: any;
  constructor(param: Param) {
    super(param.scene, param.x, param.y);
    this.setSize(param.width || this.width, param.height || this.height);
    param.scene.add.existing(this);
    this.initTexture();
    this.colliderType != colliderTypeEnum.none && this.addToPhysics();
  }
  protected get colliderType() {
    return this.__proto__.constructor.colliderType; //从静态属性获取相关属性
  }
  protected get textureKeyPrefix() {
    return this.__proto__.constructor.textureKeyPrefix; //从静态属性获取相关属性
  }
  public get tileType() {
    return this.__proto__.constructor.tileType; //从静态属性获取相关属性
  }
  protected initTexture() {
    const texture = this.textureKeyPrefix
      ? `${this.textureKeyPrefix}_${this.tileType}`
      : this.tileType;
    this.add(this.scene.add.image(0, 0, texture).setOrigin(0, 0));
  }
  addToPhysics() {
    this.scene.physics.add.existing(this);
    (<Phaser.Physics.Arcade.Body>this.body).offset.x = this.width / 2;
    (<Phaser.Physics.Arcade.Body>this.body).offset.y = this.height / 2;
    if (this.colliderType === colliderTypeEnum.collision) {
      (<Phaser.Physics.Arcade.Body>this.body).setImmovable(true); //禁止被碰撞后移动
    }
    // const g = this.scene.add.graphics();
    // g.fillStyle(0x000000, 0.5).fillRect(0, 0, this.width, this.height);
    // this.add(g);
    // this.add(this.scene.add.text(0, 0, this.id.substr(-4),{
    //   fontSize: "32px",
    //   color: "#000",
    // }));
  }
}
