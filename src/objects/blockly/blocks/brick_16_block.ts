import BaseBlock from "./baseBlock";
export default class Brick_16_Block extends BaseBlock {
  static blockName = "Brick_16_Block";
  constructor(param: Blockly.BlockParams) {
    super({ ...param, block: "blockly_block_brick_16" });
  }
  get code() {
    return {
      blockId: this.id,
      codeStr: "this.carry('brick_16')",
    };
  }
}
