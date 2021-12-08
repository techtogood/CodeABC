import getTexture from "../getTexture";
import BaseRunPanel from "./baseRunPanel";
/**
 * @enum 纹理
 */
const Texture = getTexture("theme_3");
export default class RunPanel extends BaseRunPanel {
  constructor(param: Blockly.RunPanelParam) {
    super({ ...param, textures: Texture });
  }
}
