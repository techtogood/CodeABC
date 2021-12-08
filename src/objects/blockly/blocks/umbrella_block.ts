import BaseBlock from "./baseBlock";
export default class UmbrellaBlock extends BaseBlock {
  static blockName = "UmbrellaBlock";
  constructor(param: Blockly.BlockParams) {
    super({ ...param, block: "blockly_block_umbrella" });
  }
  get code() {
    return {
      blockId:this.id,
      codeStr: "this.carry('umbrella')",
    };
  }
}
