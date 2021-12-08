import BaseBlock from "./baseBlock";
export default class Drink_1_Block extends BaseBlock {
  static blockName = "Drink_1_Block";
  constructor(param: Blockly.BlockParams) {
    super({ ...param, block: "blockly_block_drink_1" });
  }
  get code() {
    return {
      blockId: this.id,
      codeStr: "this.carry('drink_1')",
    };
  }
}
