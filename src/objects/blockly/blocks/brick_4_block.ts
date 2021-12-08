import BaseBlock from "./baseBlock";
export default class Brick_4_Block extends BaseBlock {
  static blockName = "Brick_4_Block";
  constructor(param: Blockly.BlockParams) {
    super({ ...param, block: "blockly_block_brick_4" });
  }
  get code() {
    return {
      blockId: this.id,
      codeStr: "this.carry('brick_4')",
    };
  }
}
