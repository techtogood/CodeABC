import BaseBlock from "./baseBlock";
export default class W_Block extends BaseBlock {
  static blockName = "W_Block";
  constructor(param: Blockly.BlockParams) {
    super({ ...param, block: "blockly_block_w" });
  }
  get code() {
    return {
      blockId: this.id,
      codeStr: "this.carry('w')",
    };
  }
}
