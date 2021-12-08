import BaseBlock from "./baseBlock";
export default class RightBlock extends BaseBlock {
  static blockName = "RightBlock";
  constructor(param: Blockly.BlockParams) {
    super({ ...param, block: "blockly_block_right" });
  }
  get code() {
    return {
      blockId:this.id,
      codeStr: "this.role.right()",
    };
  }
}
