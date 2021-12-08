import BaseBlock from "./baseBlock";
export default class Drink_4_Block extends BaseBlock {
  static blockName = "Drink_4_Block";
  constructor(param: Blockly.BlockParams) {
    super({ ...param, block: "blockly_block_drink_4" });
  }
  get code() {
    return {
      blockId: this.id,
      codeStr: "this.carry('drink_4')",
    };
  }
}
