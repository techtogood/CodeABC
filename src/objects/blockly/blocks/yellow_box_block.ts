import BaseBlock from "./baseBlock";
export default class YellowBoxBlock extends BaseBlock {
  static blockName = "YellowBoxBlock";
  constructor(param: Blockly.BlockParams) {
    super({ ...param, block: "blockly_block_yellow_box" });
  }
  get code() {
    return {
      blockId: this.id,
      codeStr: "this.carry('yellow_box')",
    };
  }
}
