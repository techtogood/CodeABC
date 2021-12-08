import BaseBlock from "./baseBlock";
export default class FootballBlock extends BaseBlock {
  static blockName = "FootballBlock";
  constructor(param: Blockly.BlockParams) {
    super({ ...param, block: "blockly_block_football" });
  }
  get code() {
    return {
      blockId:this.id,
      codeStr: "this.carry('football')",
    };
  }
}
