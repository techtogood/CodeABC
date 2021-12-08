import BaseBlock from "./baseBlock";
export default class TopParamBlock extends BaseBlock {
  static blockName = "TopParamBlock";
  constructor(param: Blockly.BlockParams) {
    const { scene, theme, paramList, isInfinite } = param;
    super({
      scene,
      theme,
      block: "blockly_block_top_param",
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
      blockId:this.id,
      codeStr: `this.role.topParam(${this.paramText.text})`,
    };
  }
}
