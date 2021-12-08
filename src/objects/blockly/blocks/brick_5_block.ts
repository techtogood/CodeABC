import BaseBlock from "./baseBlock";
export default class Brick_5_Block extends BaseBlock {
  static blockName = "Brick_5_Block";
  constructor(param: Blockly.BlockParams) {
    super({ ...param, block: "blockly_block_brick_5" });
  }
  get code() {
    return {
      blockId: this.id,
      codeStr: "this.carry('brick_5')",
    };
  }
}
