import BaseBlock from "./baseBlock";
export default class O_Block extends BaseBlock {
  static blockName = "O_Block";
  constructor(param: Blockly.BlockParams) {
    super({ ...param, block: "blockly_block_o" });
  }
  get code() {
    return {
      blockId: this.id,
      codeStr: "this.carry('o')",
    };
  }
}
