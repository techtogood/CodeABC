import BaseBlock from "./baseBlock";
export default class RulerBlock extends BaseBlock {
  static blockName = "RulerBlock";
  constructor(param: Blockly.BlockParams) {
    super({ ...param, block: "blockly_block_ruler" });
  }
  get code() {
    return {
      blockId: this.id,
      codeStr: "this.carry('ruler')",
    };
  }
}
