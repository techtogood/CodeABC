import BaseBlock from "./baseBlock";
export default class Z_Block extends BaseBlock {
  static blockName = "Z_Block";
  constructor(param: Blockly.BlockParams) {
    super({ ...param, block: "blockly_block_z" });
  }
  get code() {
    return {
      blockId: this.id,
      codeStr: "this.carry('z')",
    };
  }
}
