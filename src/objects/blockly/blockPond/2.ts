/**
 * @flie block池子,用于存放初始的block
 */
 import getTexture from "../getTexture";
 import BaseBlockPond from "./baseBlockPond";
 /**
  * @enum 纹理
  */
 const Texture = getTexture("theme_2");
 export default class BlockPond extends BaseBlockPond {
   constructor(param: Blockly.BlockPondParam) {
     super({ ...param, textures: Texture });
   }
 }
 