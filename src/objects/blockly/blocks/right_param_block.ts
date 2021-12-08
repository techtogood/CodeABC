import BaseBlock from "./baseBlock";
export default class RightParamBlock extends BaseBlock {
  static blockName = "RightParamBlock";
  constructor(param: Blockly.BlockParams) {
    const { scene, theme, paramList, isInfinite } = param;
    super({
      scene,
      theme,
      block: "blockly_block_right_param",
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
      codeStr: `this.role.rightParam(${this.paramText.text})`,
    };
  }
}
