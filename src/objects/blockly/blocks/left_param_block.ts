import BaseBlock from "./baseBlock";
export default class LeftParamBlock extends BaseBlock {
  static blockName = "LeftParamBlock";
  constructor(param: Blockly.BlockParams) {
    const { scene, theme, paramList, isInfinite } = param;
    super({
      scene,
      theme,
      block: "blockly_block_left_param",
      blockParamConfig: {
        x: 58,
        y: 2,
        list: paramList,
      },
      isInfinite,
    });
  }
  get code() {
    return {
      blockId: this.id,
      codeStr: `this.role.leftParam(${this.paramText.text})`,
    };
  }
}
