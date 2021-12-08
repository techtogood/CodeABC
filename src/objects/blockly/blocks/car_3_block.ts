import BaseBlock from "./baseBlock";
export default class Car_3_Block extends BaseBlock {
  static blockName = "Car_3_Block";
  constructor(param: Blockly.BlockParams) {
    super({ ...param, block: "blockly_block_car_3" });
  }
  get code() {
    return {
      blockId: this.id,
      codeStr: "this.initCar('car_3')",
    };
  }
}
