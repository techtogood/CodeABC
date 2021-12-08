import BaseBlock from "./baseBlock";
export default class Drink_2_Block extends BaseBlock {
  static blockName = "Drink_2_Block";
  constructor(param: Blockly.BlockParams) {
    super({ ...param, block: "blockly_block_drink_2" });
  }
  get code() {
    return {
      blockId: this.id,
      codeStr: "this.carry('drink_2')",
    };
  }
}
