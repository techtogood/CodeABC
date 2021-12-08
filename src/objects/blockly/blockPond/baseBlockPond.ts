/**
 * @flie block池子,用于存放初始的block
 */
const SCALE = 1.1; //block在初始容器的缩放值
import { getRect } from "@/utils/index";
export default class BaseBlockPond
  extends Phaser.GameObjects.Container
  implements Blockly.InterfaceBlockPond {
  private spaceWidth: number = 30; //block的间距
  private initScale = SCALE;
  constructor(param: Blockly.BaseBlockPondParam) {
    super(param.scene);
    this.initScale = param.initScale || SCALE;
    const bg = param.scene.add
      .image(0, 0, param.textures.blockPond_bg)
      .setOrigin(0, 0);

    const {
      x = (+param.scene.game.config.width - bg.width) / 2,
      y = +param.scene.game.config.height - bg.height,
      children,
    } = param;
    this.setSize(bg.width, bg.height);
    this.setPosition(x, y);
    this.add([bg, ...children]);
    this.scene.add.existing(this);
    /**标记children的索引,用于布局的位置，并设置children的源容器 */
    children.forEach((item: Blockly.BaseBlockInstance, index: number) =>
      item.setData("index", index).setOriginContainer(this)
    );
    this.layoutChildrenBlock(false);
  }
  /**
   * 布局池子内的block
   */
  layoutChildrenBlock(isTween = true) {
    const children = this.sort("index", (current, next) => {
      //根据给定的属性，对此Container的内容进行排序
      return current.getData("index") > next.getData("index");
    }).getAll("id");
    if (children.length === 0) return;
    const totalWidth = children.reduce((prev, current: Blockly.BaseBlock) => {
      return prev + current.width;
    }, 0);
    const offectX =
      (this.width -
        totalWidth * this.initScale -
        (children.length - 1) * this.spaceWidth) /
      2;
    let x = offectX;
    for (let i = 0; i < children.length; i++) {
      const target = <Blockly.BaseBlockInstance>children[i];
      const duration = isTween ? 300 : 0;
      // asyncTween(this.scene, {
      //   targets: target,
      //   y: (this.height - target.height) / 2,
      //   x,
      //   duration,
      // });
      target.moveToPosition(
        { y: (this.height - target.height) / 2, x },
        duration
      );
      target.setBlockScale(this.initScale, isTween, duration);
      x = x + target.width * this.initScale + this.spaceWidth * this.initScale;
    }
  }
  /**
   * block没有被放置，则复原这里
   * @param block
   * @param isTween
   * @param isInfinite 是否是无限block
   */
  resetBlock(
    block: Blockly.BaseBlockInstance,
    isTween = true,
    isInfinite = false
  ): void {
    if (!isInfinite) {
      if (!block.parentContainer) {
        const { left, top } = getRect(this);
        block.x -= left;
        block.y -= top;
        this.add(block);
      }
      this.layoutChildrenBlock(isTween);
    } else if (!block.parentContainer) {
      const duration = isTween ? 300 : 0;
      const rect = getRect(block.originContainer);
      this.scene.tweens.add({
        targets: block,
        y: rect.top,
        x: rect.left,
        // ease:"Circ.easeInOut",
        duration,
        // completeDelay: 100,//?
        onComplete: () => {
          block.destroy();
          (<Blockly.InfiniteBlockContainer>block.originContainer).removeChild(
            block.id
          );
        },
      });
      block.setBlockScale(this.initScale, isTween, duration);
    }
  }
}
