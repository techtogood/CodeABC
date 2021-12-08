import BaseBlock from "./baseBlock";
export default class Car_4_Block extends BaseBlock {
  static blockName = "Car_4_Block";
  constructor(param: Blockly.BlockParams) {
    super({ ...param, block: "blockly_block_car_4" });
  }
  get code() {
    return {
      blockId: this.id,
      codeStr: "this.initCar('car_4')",
    };
  }
}
