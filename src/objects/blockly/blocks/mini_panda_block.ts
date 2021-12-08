import BaseBlock from "./baseBlock";
export default class MiniPandaBlock extends BaseBlock {
  static blockName = "MiniPandaBlock";
  constructor(param: Blockly.BlockParams) {
    super({ ...param, block: "blockly_block_panda" });
  }
  get code() {
    return {
      blockId:this.id,
      codeStr: "this.carry('mini_panda')",
    };
  }
}
