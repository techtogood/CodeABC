import BaseBlock from "./baseBlock";
export default class Brick_2_Block extends BaseBlock {
  static blockName = "Brick_2_Block";
  constructor(param: Blockly.BlockParams) {
    super({ ...param, block: "blockly_block_brick_2" });
  }
  get code() {
    return {
      blockId: this.id,
      codeStr: "this.carry('brick_2')",
    };
  }
}
