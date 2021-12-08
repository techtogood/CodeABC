import BaseBlock from "./baseBlock";
export default class Brick_13_Block extends BaseBlock {
  static blockName = "Brick_13_Block";
  constructor(param: Blockly.BlockParams) {
    super({ ...param, block: "blockly_block_brick_13" });
  }
  get code() {
    return {
      blockId: this.id,
      codeStr: "this.carry('brick_13')",
    };
  }
}
