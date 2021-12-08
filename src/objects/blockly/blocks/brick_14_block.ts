import BaseBlock from "./baseBlock";
export default class Brick_14_Block extends BaseBlock {
  static blockName = "Brick_14_Block";
  constructor(param: Blockly.BlockParams) {
    super({ ...param, block: "blockly_block_brick_14" });
  }
  get code() {
    return {
      blockId: this.id,
      codeStr: "this.carry('brick_14')",
    };
  }
}
