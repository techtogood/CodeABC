import BaseBlock from "./baseBlock";
export default class A_Block extends BaseBlock {
  static blockName = "A_Block";
  constructor(param: Blockly.BlockParams) {
    super({ ...param, block: "blockly_block_a" });
  }
  get code() {
    return {
      blockId: this.id,
      codeStr: "this.carry('a')",
    };
  }
}
