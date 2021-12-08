import BaseBlock from "./baseBlock";
export default class Brick_6_Block extends BaseBlock {
  static blockName = "Brick_6_Block";
  constructor(param: Blockly.BlockParams) {
    super({ ...param, block: "blockly_block_brick_6" });
  }
  get code() {
    return {
      blockId: this.id,
      codeStr: "this.carry('brick_6')",
    };
  }
}
