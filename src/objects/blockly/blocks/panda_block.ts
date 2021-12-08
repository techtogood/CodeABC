import BaseBlock from "./baseBlock";
export default class PandaBlock extends BaseBlock {
  static blockName = "PandaBlock";
  constructor(param: Blockly.BlockParams) {
    super({ ...param, block: "blockly_block_panda" });
  }
  get code() {
    return {
      blockId:this.id,
      codeStr: "this.carry('panda')",
    };
  }
}
