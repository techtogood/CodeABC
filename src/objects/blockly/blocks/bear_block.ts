import BaseBlock from "./baseBlock";
export default class BearBlock extends BaseBlock {
  static blockName = "BearBlock";
  constructor(param: Blockly.BlockParams) {
    super({ ...param, block: "blockly_block_bear" });
  }
  get code() {
    return {
      blockId:this.id,
      codeStr: "this.carry('bear')",
    };
  }
}
