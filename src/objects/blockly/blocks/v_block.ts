import BaseBlock from "./baseBlock";
export default class V_Block extends BaseBlock {
  static blockName = "V_Block";
  constructor(param: Blockly.BlockParams) {
    super({ ...param, block: "blockly_block_v" });
  }
  get code() {
    return {
      blockId: this.id,
      codeStr: "this.carry('v')",
    };
  }
}
