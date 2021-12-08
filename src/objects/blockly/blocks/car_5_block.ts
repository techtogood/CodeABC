import BaseBlock from "./baseBlock";
export default class Car_5_Block extends BaseBlock {
  static blockName = "Car_5_Block";
  constructor(param: Blockly.BlockParams) {
    super({ ...param, block: "blockly_block_car_5" });
  }
  get code() {
    return {
      blockId: this.id,
      codeStr: "this.initCar('car_5')",
    };
  }
}
