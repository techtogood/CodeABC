import BaseBlock from "./baseBlock";
export default class Brick_11_Block extends BaseBlock {
  static blockName = "Brick_11_Block";
  constructor(param: Blockly.BlockParams) {
    super({ ...param, block: "blockly_block_brick_11" });
  }
  get code() {
    return {
      blockId: this.id,
      codeStr: "this.carry('brick_11')",
    };
  }
}
