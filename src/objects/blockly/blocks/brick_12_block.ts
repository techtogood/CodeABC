import BaseBlock from "./baseBlock";
export default class Brick_12_Block extends BaseBlock {
  static blockName = "Brick_12_Block";
  constructor(param: Blockly.BlockParams) {
    super({ ...param, block: "blockly_block_brick_12" });
  }
  get code() {
    return {
      blockId: this.id,
      codeStr: "this.carry('brick_12')",
    };
  }
}
