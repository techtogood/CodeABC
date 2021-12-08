import BaseBlock from "./baseBlock";
export default class LeftBlock extends BaseBlock {
  static blockName = "LeftBlock";
  constructor(param: Blockly.BlockParams) {
    super({ ...param, block: "blockly_block_left" });
  }
  get code() {
    return {
      blockId:this.id,
      codeStr: "this.role.left()",
    };
  }
}
