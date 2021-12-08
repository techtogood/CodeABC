type Param = {
  scene: Phaser.Scene;
  x: number;
  y: number;
  onPointerdown(param: number): void;
  onClose(): void;
  paramList: number[];
};
const LeftWidth = 26;
const MidWidth = 87;
// const RightWidth = 14;
export default class NumberParamBubbleBox extends Phaser.GameObjects.Container {
  private param: Param;
  depth = 601;
  // private maskZooe: Phaser.GameObjects.Zone;
  constructor(param: Param) {
    super(param.scene, param.x, param.y);
    this.param = param;
    const left = param.scene.add
      .image(0, 0, "blockly_theme_3_numberParamBubbleBox_left")
      .setOrigin(0, 0.5);
    const midList = this.getMidList(this.param.paramList);
    const right = param.scene.add
      .image(
        LeftWidth + this.param.paramList.length * MidWidth,
        0,
        "blockly_theme_3_numberParamBubbleBox_right"
      )
      .setOrigin(0, 0.5);
    this.add([left, ...midList, right]);
    // this.maskZooe = this.param.scene.add
    //   .zone(
    //     0,
    //     0,
    //     +this.param.scene.game.config.width,
    //     +this.param.scene.game.config.height
    //   )
    //   .setOrigin(0, 0)
    //   .setDepth(600);
    // this.maskZooe
    //   .setInteractive()
    //   .on(
    //     "pointerdown",
    //     (
    //       pointer: Phaser.Input.Pointer,
    //       localX: number,
    //       localY: number,
    //       event: Phaser.Types.Input.EventData
    //     ) => {
    //       this.close();
    //       // event.stopPropagation();
    //     }
    //   );
    this.handlePointerOther = this.handlePointerOther.bind(this)
    this.scene.input.on("pointerdown", this.handlePointerOther);
  }
  handlePointerOther(
    pointer: Phaser.Input.Pointer,
    localX: number,
    localY: number,
    event: Phaser.Types.Input.EventData
  ) {
    // if()
    this.close();
  }
  close() {
    // this.maskZooe.destroy();
    this.scene.input.off("pointerdown", this.handlePointerOther);
    this.destroy();
    this.param.onClose();
  }
  getMidList(paramList): Phaser.GameObjects.Container[] {
    let x = LeftWidth;
    return paramList.map((param: number) => {
      const mid = this.param.scene.add
        .image(0, 0, "blockly_theme_3_numberParamBubbleBox_mid")
        .setOrigin(0, 0.5);
      const text = this.param.scene.add
        .text(mid.width / 2, 0, param.toString(), {
          fontSize: "40px",
          fontFamily: "PuHuiTi",
          color: "#FFFFFF",
        })
        .setOrigin(0.5, 0.5);
      const c = this.param.scene.add.container(x, 0, [mid, text]);
      mid
        .setInteractive()
        .on(
          "pointerdown",
          (
            pointer: Phaser.Input.Pointer,
            localX: number,
            localY: number,
            event: Phaser.Types.Input.EventData
          ) => {
            this.scene.musicManager.play("click");
            this.param.onPointerdown(param);
            this.close();
            // event.stopPropagation();
          }
        );
      x += MidWidth;
      return c;
    });
  }
}
