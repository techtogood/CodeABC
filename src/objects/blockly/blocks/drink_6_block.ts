import BaseBlock from "./baseBlock";
export default class Drink_6_Block extends BaseBlock {
  static blockName = "Drink_6_Block";
  constructor(param: Blockly.BlockParams) {
    super({ ...param, block: "blockly_block_drink_6" });
  }
  get code() {
    return {
      blockId: this.id,
      codeStr: "this.carry('drink_6')",
    };
  }
}
