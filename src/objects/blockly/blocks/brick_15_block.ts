import BaseBlock from "./baseBlock";
export default class Brick_15_Block extends BaseBlock {
  static blockName = "Brick_15_Block";
  constructor(param: Blockly.BlockParams) {
    super({ ...param, block: "blockly_block_brick_15" });
  }
  get code() {
    return {
      blockId: this.id,
      codeStr: "this.carry('brick_15')",
    };
  }
}
