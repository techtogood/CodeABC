import BaseBlock from "./baseBlock";
export default class Brick_1_Block extends BaseBlock {
  static blockName = "Brick_1_Block";
  constructor(param: Blockly.BlockParams) {
    super({ ...param, block: "blockly_block_brick_1" });
  }
  get code() {
    return {
      blockId: this.id,
      codeStr: "this.carry('brick_1')",
    };
  }
}
