import BaseBlock from "./baseBlock";
export default class Drink_3_Block extends BaseBlock {
  static blockName = "Drink_3_Block";
  constructor(param: Blockly.BlockParams) {
    super({ ...param, block: "blockly_block_drink_3" });
  }
  get code() {
    return {
      blockId: this.id,
      codeStr: "this.carry('drink_3')",
    };
  }
}
