import BaseBlock from "./baseBlock";
export default class MiniBearBlock extends BaseBlock {
  static blockName = "MiniBearBlock";
  constructor(param: Blockly.BlockParams) {
    super({ ...param, block: "blockly_block_bear" });
  }
  get code() {
    return {
      blockId:this.id,
      codeStr: "this.carry('mini_bear')",
    };
  }
}
