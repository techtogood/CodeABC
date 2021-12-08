import BaseBlock from "./baseBlock";
export default class N_Block extends BaseBlock {
  static blockName = "N_Block";
  constructor(param: Blockly.BlockParams) {
    super({ ...param, block: "blockly_block_n" });
  }
  get code() {
    return {
      blockId: this.id,
      codeStr: "this.carry('n')",
    };
  }
}
