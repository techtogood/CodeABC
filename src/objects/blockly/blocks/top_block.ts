import BaseBlock from "./baseBlock";
export default class TopBlock extends BaseBlock {
  static blockName = "TopBlock";
  constructor(param: Blockly.BlockParams) {
    super({ ...param, block: "blockly_block_top" });
  }
  get code() {
    return {
      blockId:this.id,
      codeStr: "this.role.top()",
    };
  }
}
