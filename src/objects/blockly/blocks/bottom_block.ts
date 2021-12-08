import BaseBlock from "./baseBlock";
export default class BottomBlock extends BaseBlock {
  static blockName = "BottomBlock";
  constructor(param: Blockly.BlockParams) {
    super({ ...param, block: "blockly_block_bottom" });
  }
  get code() {
    return {
      blockId: this.id,
      codeStr: "this.role.bottom()",
    };
  }
}
