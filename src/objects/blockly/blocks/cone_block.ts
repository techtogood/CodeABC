import BaseBlock from "./baseBlock";
export default class ConeBlock extends BaseBlock {
  static blockName = "ConeBlock";
  constructor(param: Blockly.BlockParams) {
    super({ ...param, block: "blockly_block_cone" });
  }
  get code() {
    return {
      blockId:this.id,
      codeStr: "this.carry('cone')",
    };
  }
}
