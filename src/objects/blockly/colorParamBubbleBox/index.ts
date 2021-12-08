type Param = {
  scene: Phaser.Scene;
  x: number;
  y: number;
  onPointerdown(colorStr: string): void;
  onClose(): void;
  paramList: number[];
};
const LeftWidth = 26;
const MidWidth = 87;
// const RightWidth = 14;
const ColorMap = {
  yellow: 0xffd23b,
  blue: 0x4f93ff,
  green: 0x71db6c,
};
export default class colorParamBubbleBox extends Phaser.GameObjects.Container {
  private param: Param;
  depth = 601;
  // private maskZooe: Phaser.GameObjects.Zone;
  constructor(param: Param) {
    super(param.scene, param.x, param.y);
    this.param = param;
    const left = param.scene.add
      .image(0, 0, "blockly_theme_4_colorParamBubbleBox_left")
      .setOrigin(0, 0.5);
    const midList = this.getMidList(this.param.paramList);
    const right = param.scene.add
      .image(
        LeftWidth + this.param.paramList.length * MidWidth,
        0,
        "blockly_theme_4_colorParamBubbleBox_right"
      )
      .setOrigin(0, 0.5);
    this.add([left, ...midList, right]);
    this.handlePointerOther = this.handlePointerOther.bind(this);
    this.scene.input.on("pointerdown", this.handlePointerOther);
  }
  handlePointerOther() {
    this.close();
  }
  close() {
    this.scene.input.off("pointerdown", this.handlePointerOther);
    this.destroy();
    this.param.onClose();
  }
  getMidList(paramList): Phaser.GameObjects.Container[] {
    let x = LeftWidth;
    return paramList.map((colorStr: string) => {
      const mid = this.param.scene.add
        .image(0, 0, "blockly_theme_4_colorParamBubbleBox_mid")
        .setOrigin(0, 0.5);
      const roundedRect = this.scene.add
        .graphics()
        .fillStyle(ColorMap[colorStr], 1)
        .fillRoundedRect(11, 21 - mid.height / 2, 68, 61, 23);
      const c = this.param.scene.add
        .container(x, 0, [mid, roundedRect])
        .setSize(mid.width, mid.height);
      mid.setInteractive().on("pointerdown", () => {
        this.scene.musicManager.play("click");
        this.param.onPointerdown(colorStr);
        this.close();
      });
      x += MidWidth;
      return c;
    });
  }
}
