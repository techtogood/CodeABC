import BaseBlock from "./baseBlock";
export default class ShovelBlock extends BaseBlock {
  static blockName = "ShovelBlock";
  constructor(param: Blockly.BlockParams) {
    super({ ...param, block: "blockly_block_shovel" });
  }
  get code() {
    return {
      blockId: this.id,
      codeStr: "this.carry('shovel')",
    };
  }
}
