import BaseBlock from "./baseBlock";
export default class BottomParamBlock extends BaseBlock {
  static blockName = "BottomParamBlock";
  constructor(param: Blockly.BlockParams) {
    const { scene, theme, paramList, isInfinite } = param;
    super({
      scene,
      theme,
      block: "blockly_block_bottom_param",
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
      codeStr: `this.role.bottomParam(${this.paramText.text})`,
    };
  }
}
