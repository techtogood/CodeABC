/**
 * 扩展zone作为放置交互的区域
 */
import BlockContainer from "./blockContainer";
type DropZoneParam = {
  scene: Phaser.Scene;
  x: number;
  y: number;
  width: number;
  height: number;
  container: BlockContainer;
  //while_block实例化时，传递的回调
  onDragenter?:(block: Blockly.BaseBlock)=>void;
  onDragover?:(block: Blockly.BaseBlock)=>void;
  onDragleave?:(block: Blockly.BaseBlock)=>void;
  onDrop?:(block: Blockly.BaseBlock)=>void;
};
export default class DropZone extends Phaser.GameObjects.Zone {
  private param:DropZoneParam;
  private disabled:boolean;
  constructor(param: DropZoneParam) {
    const { scene, x, y, width, height } = param;
    super(scene, x, y, width, height);
    this.param = param;
    this.setRectangleDropZone(width, height);
    this.setOrigin(0, 0);
    this.disabled = false;
  }
  updateHitArea(){
    this.input.hitArea.setSize(this.width,this.height)
  }
  dragenterBlock(block: Blockly.BaseBlock) {
    if(this.disabled) return
    this.param.container.dragenterBlock(block);
    this.param.onDragenter&&this.param.onDragenter(block);
  }
  dragoverBlock(block: Blockly.BaseBlock, placeholderTextureKey: string) {
    if(this.disabled) return
    this.param.container.dragoverBlock(block, placeholderTextureKey);
    this.param.onDragover&&this.param.onDragover(block);
  }
  dragleaveBlock(block: Blockly.BaseBlock) {
    if(this.disabled) return
    this.param.container.dragleaveBlock(block);
    this.param.onDragleave&&this.param.onDragleave(block);
  }
  dropBlock(block: Blockly.BaseBlock) {
    if(this.disabled) return
    this.param.container.dropBlock(block);
    this.param.onDrop&&this.param.onDrop(block);
  }
  setDisabled(bool:boolean){
    this.disabled = bool;
  }
}
