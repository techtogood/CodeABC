import BaseBlock from "./baseBlock";
export default class RocketsBlock extends BaseBlock {
  static blockName = "RocketsBlock";
  constructor(param: Blockly.BlockParams) {
    super({ ...param, block: "blockly_block_rockets" });
  }
  get code() {
    return {
      blockId: this.id,
      codeStr: "this.carry('rockets')",
    };
  }
}
