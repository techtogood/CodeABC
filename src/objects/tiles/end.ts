/**
 * 终点,role移动到这里后就会结束游戏
 */
import { colliderTypeEnum } from "@/enum";
import { setColliderType, setTileType } from "@/decorators";
import BaseTiles from "./baseTiles";
@setTileType("end")
@setColliderType(colliderTypeEnum.overlaps)
export default class End extends BaseTiles {
  /**
   * @override
   * // 不需要渲染
   */
  initTexture() {
    // const g = param.scene.add.graphics();
    // g.fillStyle(0x000000).fillRect(0,0,this.width,this.height);
    // this.add(g);
  }
}
