import BaseBlock from "./baseBlock";
export default class Brick_7_Block extends BaseBlock {
  static blockName = "Brick_7_Block";
  constructor(param: Blockly.BlockParams) {
    super({ ...param, block: "blockly_block_brick_7" });
  }
  get code() {
    return {
      blockId: this.id,
      codeStr: "this.carry('brick_7')",
    };
  }
}
