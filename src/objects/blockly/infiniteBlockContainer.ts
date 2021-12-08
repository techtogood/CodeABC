/**
 * 可以无限拖拽block的容器
 */
export default class InfiniteBlockContainer
  extends Phaser.GameObjects.Container
  implements Blockly.InfiniteBlockInterface, Blockly.InterfaceBlockPond {
  static id = "infinte_block";
  public id = InfiniteBlockContainer.id;
  private child: Blockly.BaseBlockInstance;
  public originContainer: Blockly.BlockPond;
  public blockChildren: Blockly.BaseBlockInstance[] = [];
  maxSize = 2; //显示的block+复制的block
  constructor(param) {
    super(param.scene, 0, 0, param.child);
    this.child = param.child;
    this.blockChildren.push(this.child);
    this.setSize(this.child.width, this.child.height);
  }
  setOriginContainer(param) {
    this.originContainer = param;
    this.child.setOriginContainer(this);
    return this;
  }
  resetBlock(block) {
    this.originContainer.resetBlock(block, true, true);
  }
  setBlockScale(SCALE, isTween, duration) {
    this.child.setBlockScale(SCALE, isTween, duration);
    return this;
  }
  addAt(
    child: Blockly.BaseBlockInstance,
    index?: integer
  ):this {
    this.child = child;
    this.blockChildren.push(this.child);
    super.addAt(child, index);
    return this;
  }
  removeChild(blockId: string) {
    const index = this.blockChildren.findIndex((item) => item.id === blockId);
    index > -1 && this.blockChildren.splice(index, 1);
  }
}
