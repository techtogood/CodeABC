import BaseBlock from "./baseBlock";
export default class Drink_5_Block extends BaseBlock {
  static blockName = "Drink_5_Block";
  constructor(param: Blockly.BlockParams) {
    super({ ...param, block: "blockly_block_drink_5" });
  }
  get code() {
    return {
      blockId: this.id,
      codeStr: "this.carry('drink_5')",
    };
  }
}
