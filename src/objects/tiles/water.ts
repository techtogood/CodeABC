/**
 * 货币
 */

import { asyncTween, sleep } from "@/utils";
import BaseTiles from "./baseTiles";
import { colliderTypeEnum } from "@/enum";
import { setTileType, setTextureKeyPrefix, setColliderType } from "@/decorators";
@setTileType("water")
@setTextureKeyPrefix("tiles")
@setColliderType(colliderTypeEnum.overlaps)
export default class Water extends BaseTiles {
  private currency: Phaser.GameObjects.Image;
  private currencyShadow: Phaser.GameObjects.Image;
  constructor(param: ContainerParams) {
    super(param);
  }
  /**
   * @override
   */
  initTexture() {
    this.currency = this.scene.add
      .image(51, 52, `${this.textureKeyPrefix}_${this.tileType}`)
      .setOrigin(0.5, 1);
    this.currencyShadow = this.scene.add
      .image(51, 66, `${this.textureKeyPrefix}_${this.tileType}_shadow`)
      .setOrigin(0.5, 0);
    this.add([this.currencyShadow, this.currency]);
  }
  /**
   * 收集货币的补间动画
   */
   async collect() {
    await sleep(this.scene,5000/12);//这个时间和帧动画的帧率有关
    this.scene.musicManager.play('get');
    asyncTween(this.scene, {
      targets: this.currencyShadow,
      scale: 0,
      duration: 400,
    });
    await asyncTween(this.scene, {
      targets: this.currency,
      y: this.currency.y - 102,
      duration: 400,
    });
    this.destroy();
  }
}
