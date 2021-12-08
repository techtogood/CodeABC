import BaseBlock from "./baseBlock";
export default class Brick_17_Block extends BaseBlock {
  static blockName = "Brick_17_Block";
  constructor(param: Blockly.BlockParams) {
    super({ ...param, block: "blockly_block_brick_17" });
  }
  get code() {
    return {
      blockId: this.id,
      codeStr: "this.carry('brick_17')",
    };
  }
}
