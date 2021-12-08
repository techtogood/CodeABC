import BaseBlock from "./baseBlock";
export default class Brick_3_Block extends BaseBlock {
  static blockName = "Brick_3_Block";
  constructor(param: Blockly.BlockParams) {
    super({ ...param, block: "blockly_block_brick_3" });
  }
  get code() {
    return {
      blockId: this.id,
      codeStr: "this.carry('brick_3')",
    };
  }
}
