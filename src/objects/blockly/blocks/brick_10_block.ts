import BaseBlock from "./baseBlock";
export default class Brick_10_Block extends BaseBlock {
  static blockName = "Brick_10_Block";
  constructor(param: Blockly.BlockParams) {
    super({ ...param, block: "blockly_block_brick_10" });
  }
  get code() {
    return {
      blockId: this.id,
      codeStr: "this.carry('brick_10')",
    };
  }
}
