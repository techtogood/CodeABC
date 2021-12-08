import BaseBlock from "./baseBlock";
import ColorParamBubbleBox from "../colorParamBubbleBox";
import { getRect } from "@/utils";
type BlockParamConfig = {
  x: number;
  y: number;
  list: Array<any>;
};
const TexturePrefix = "blockly_block";
export default class BoxParamBlock extends BaseBlock {
  static blockName = "BoxParamBlock";
  private colorStr: string;
  constructor(param: Blockly.BlockParams) {
    const { scene, theme, paramList, isInfinite } = param;
    super({
      scene,
      theme,
      block: "blockly_block_yellow_box_param",
      blockParamConfig: {
        x: 58,
        y: 2,
        list: paramList || ["yellow", "blue", "green"],
      },
      isInfinite,
    });
  }
  get code() {
    return {
      blockId: this.id,
      codeStr: `this.carry('${this.colorStr}_box')`,
    };
  }
  /**
   * 创建参数
   * @param config
   */
  protected createBlockParam(config: BlockParamConfig) {
    this.blockParamConfig = config;
    // 交互区域
    const x = (this.width - this.ParamZoneWidth) / 2 + config.x;
    const y = (this.height - this.ParamZoneHeight) / 2 - config.y;
    this.paramZone = this.scene.add
      .zone(x, y, this.ParamZoneWidth, this.ParamZoneHeight)
      .setOrigin(0, 0);
    this.paramZone.setInteractive().on("pointerdown", () => {
      setTimeout(() => this.showBubbleBox(config.list)); //先执行pointerdown事件关闭其它参数选择，在显示参数选择);
    });
    this.colorStr = config.list && config.list ? config.list[0] : "yellow"; //首个参数值为默认参数
    this.add(this.paramZone);
    (<Phaser.GameObjects.Image>this._block).setTexture(
      `${TexturePrefix}_${this.colorStr}_box_param`
    );
    this.showParamSelect = true;
  }
  /**
   *  更新不同颜色box的纹理
   * @param param
   */
  protected updateText(colorStr) {
    this.colorStr = colorStr;
    (<Phaser.GameObjects.Image>this._block).setTexture(
      `${TexturePrefix}_${this.colorStr}_box_param`
    );
  }
  protected showBubbleBox(paramList) {
    if (paramList.length < 2) return;
    this.scene.musicManager.play("click");
    this.setBlockSelected(true);
    const { left, top } = getRect(this.paramZone);
    const bubbleBox = new ColorParamBubbleBox({
      scene: this.scene,
      x: left + this.paramZone.width + 30,
      y: top + this.paramZone.height / 2,
      paramList: paramList || [],
      onPointerdown: (param) => {
        this.updateText(param);
        this.setBlockSelected(false);
      },
      onClose: () => this.setBlockSelected(false),
    });
    this.scene.add.existing(bubbleBox);
  }
}
