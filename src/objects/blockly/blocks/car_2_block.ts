import BaseBlock from "./baseBlock";
export default class Car_2_Block extends BaseBlock {
  static blockName = "Car_2_Block";
  constructor(param: Blockly.BlockParams) {
    super({ ...param, block: "blockly_block_car_2" });
  }
  get code() {
    return {
      blockId: this.id,
      codeStr: "this.initCar('car_2')",
    };
  }
}
