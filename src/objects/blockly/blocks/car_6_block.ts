import BaseBlock from "./baseBlock";
export default class Car_6_Block extends BaseBlock {
  static blockName = "Car_6_Block";
  constructor(param: Blockly.BlockParams) {
    super({ ...param, block: "blockly_block_car_6" });
  }
  get code() {
    return {
      blockId: this.id,
      codeStr: "this.initCar('car_6')",
    };
  }
}
