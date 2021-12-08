import BaseBlock from "./baseBlock";
export default class WaitBlock extends BaseBlock {
  static blockName = "WaitBlock";
  constructor(param: Blockly.BlockParams) {
    super({ ...param, block: "blockly_block_wait" });
  }
  get code() {
    return {
      blockId:this.id,
      codeStr: "this.role.wait()",
    };
  }
}
