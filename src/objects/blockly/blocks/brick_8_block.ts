import BaseBlock from "./baseBlock";
export default class Brick_8_Block extends BaseBlock {
  static blockName = "Brick_8_Block";
  constructor(param: Blockly.BlockParams) {
    super({ ...param, block: "blockly_block_brick_8" });
  }
  get code() {
    return {
      blockId: this.id,
      codeStr: "this.carry('brick_8')",
    };
  }
}
