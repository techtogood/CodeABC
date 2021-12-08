import BaseBlock from "./baseBlock";
export default class Brick_9_Block extends BaseBlock {
  static blockName = "Brick_9_Block";
  constructor(param: Blockly.BlockParams) {
    super({ ...param, block: "blockly_block_brick_9" });
  }
  get code() {
    return {
      blockId: this.id,
      codeStr: "this.carry('brick_9')",
    };
  }
}
