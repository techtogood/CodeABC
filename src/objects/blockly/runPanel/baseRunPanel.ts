import BlockContainer from "../blockContainer";
import DropZone from "../dropZone";
type CodeItem = { blockId: string; codeStr: string };
export default class BaseRunPanel extends Phaser.GameObjects.Container {
  public blockContainer: BlockContainer;
  private playBtn: Phaser.GameObjects.Image;
  private playBtnDisable: boolean = false;
  private disableMask: Phaser.GameObjects.Graphics;
  private cb: Blockly.RunPanelCallBack;
  textures: Blockly.RunPanelTextures;
  constructor(param: Blockly.BaseRunPanelParam) {
    super(param.scene, 0, 0);
    const {
      x = 353 - window.offect.left,
      y = 163,
      depth,
      cb,
      textures,
    } = param;
    this.setPosition(x, y);
    this.cb = cb;
    this.textures = textures;
    const bg = this.scene.add
      .image(0, 0, this.textures.runPanel_bg)
      .setOrigin(0, 0);
    const dropBg = this.scene.add
      .image(17, 151, this.textures.drop_bg)
      .setOrigin(0, 0);
    // 收集block的容器
    this.blockContainer = new BlockContainer({
      scene: param.scene,
      x: dropBg.x,
      y: dropBg.y,
      width: dropBg.width,
      height: dropBg.height,
      showScrollBar: true,
      scrollBarTexture: {
        scrollBar: this.textures.scroll_bar,
        slider: this.textures.slider,
      },
    });
    // 放置区域
    const dropZone = new DropZone({
      scene: param.scene,
      x: dropBg.x,
      y: dropBg.y,
      width: dropBg.width,
      height: dropBg.height,
      container: this.blockContainer,
    });
    this.setDepth(depth || 0);
    this.scene.add.existing(this);
    // 设置蒙层，用于禁止操作
    const rect = new Phaser.Geom.Rectangle(0, 0, bg.width, bg.height);
    this.disableMask = this.scene.add
      .graphics()
      .fillStyle(0x000000, 0)
      .fillRectShape(rect)
      .setDepth(999);
    this.disableMask.setInteractive(
      rect,
      Phaser.Geom.Rectangle.Contains,
      false
    );
    this.add([this.disableMask, bg, dropBg, dropZone, this.blockContainer]);
    this.createPlayBtn();
  }
  public runEnd() {
    this.setPlayBtnDisable(false);
    this.setDisabled(false);
    this.playBtn.setTexture(this.textures.play_btn);
  }
  /**
   * 运行按钮
   */
  private createPlayBtn() {
    this.playBtn = this.scene.add
      .image(18, 10, this.textures.play_btn)
      .setOrigin(0, 0);
    this.add(this.playBtn);
    this.playBtn.setInteractive();
    this.playBtn.on("pointerdown", () => {
      this.scene.musicManager.play("click");
      this.playBtn.setTexture(this.textures.play_btn_focus);
    });
    this.playBtn.on("pointerup", () => {
      this.run();
    });
  }
  run() {
    if (this.playBtnDisable) return;
    this.setPlayBtnDisable(true);
    this.setDisabled(true);
    this.cb.onRun(this.getBlockCodeList());
  }
  getBlockCodeList(): Array<CodeItem> {
    return this.blockContainer
      .sort("y")
      .getAll()
      .map((item: Blockly.BaseBlockInstance) => {
        return item.code;
      });
  }
  private setPlayBtnDisable(disable: boolean) {
    this.playBtnDisable = disable;
  }
  /**
   * 禁用
   */
  public setDisabled(disable: boolean) {
    disable
      ? this.bringToTop(this.disableMask)
      : this.sendToBack(this.disableMask);
  }
}
