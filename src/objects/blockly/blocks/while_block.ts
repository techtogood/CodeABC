import BaseBlock from "./baseBlock";
import BlockContainer from "../blockContainer";
import DropZone from "../dropZone";
import { getRect } from "@/utils/index";
const blockParamConfigX = 66;
const blockParamConfigY = 45;
export default class WhileBlock extends BaseBlock<Block> {
  static blockName = "WhileBlock";
  protected placeholderType = "placeholder_2";
  private blockContainer: BlockContainer;
  private dropZone: DropZone;
  // g: Phaser.GameObjects.Graphics;
  constructor(param: Blockly.BlockParams) {
    super({
      scene: param.scene,
      theme: param.theme,
      block: new Block(param.scene, 10),
      blockParamConfig: {
        x: blockParamConfigX,
        y: blockParamConfigY,
        list: param.paramList,
      },
      isInfinite: param.isInfinite,
    });
    this.updateHitArea();
    this.initDropArea();
    this.on("dragstart", (pointer) => {
      this.dropZone.setDisabled(true);
    });
    this.on("dragend", (pointer) => {
      this.dropZone.setDisabled(false);
      if (this.parentContainer === this.originContainer) {
        // 被移除了,则清空children
        this.blockContainer
          .getAll()
          .forEach((gameObject: Blockly.BaseBlock) => {
            const rect = getRect(gameObject.parentContainer);
            const x = gameObject.x;
            const y = gameObject.y;
            gameObject.parentContainer.remove(gameObject);
            gameObject.x = x + rect.left;
            gameObject.y = y + rect.top;
            gameObject.setData("isDrop", false);
            gameObject.emit("dragend", pointer, 0, 0, false);
          });
        this.updateDropArea();
        this.originContainer.resetBlock(this);
      }
    });
  }
  get code() {
    const childrenBlockCodeList = this.blockContainer
      .sort("y")
      .getAll()
      .map((item: BaseBlock) => item.code);
    return {
      blockId: this.id,
      codeStr: `this.role.whileParam(${this.paramText.text},${JSON.stringify(
        childrenBlockCodeList
      )})`,
    };
  }
  private initDropArea() {
    // 收集block的容器
    this.blockContainer = new BlockContainer({
      scene: this.scene,
      x: this._block.x,
      y: this._block.topHeight,
      width: this._block.displayWidth,
      height: this._block.height - this._block.topHeight,
    });
    this.blockContainer.OFFECT_Y = 0;
    this.blockContainer.OFFECT_X = this._block.midWidth;
    // 放置区域
    this.dropZone = new DropZone({
      scene: this.scene,
      x: this.blockContainer.x,
      y: this.blockContainer.y,
      width: this.blockContainer.width,
      height: this.blockContainer.height,
      container: this.blockContainer,
      onDragover: (block: Blockly.BaseBlock) => this.updateDropArea(),
      onDragleave: (block: Blockly.BaseBlock) => this.updateDropArea(),
      onDrop: (block: Blockly.BaseBlock) => this.updateDropArea(),
    });
    // this.g = this.scene.add.graphics();
    this.add([this.dropZone, this.blockContainer]);
  }
  /**
   * 更新当前和所有祖先容器的放置区域,放置容器
   */
  private updateDropArea() {
    const h = this.blockContainer
      .getAll()
      .reduce((p: number, n: Phaser.GameObjects.Container) => {
        return p + n.height;
      }, 0);
    // 更新block高度
    this._block.updateMidHeight(h);
    this._block.updateHeight();
    this.setSize(this._block.width, this._block.height - this.raisedHeight);
    // 更新 this的尺寸后，导致 拖拽区域的位置变化了，需要更新一下
    this.updateHitArea();
    if (this.parentContainer) {
      // 父容器为BlockContainer,更新父容器布局
      (<Blockly.BlockContainer>this.parentContainer).layoutDropRect &&
        (<Blockly.BlockContainer>this.parentContainer).layoutDropRect();
      // 多个whileBLock嵌套，更新父容器的放置区域
      this.parentContainer.parentContainer &&
        (<any>this.parentContainer.parentContainer).updateDropArea &&
        (<any>this.parentContainer.parentContainer).updateDropArea();
    }
    // 更新放置容器和放置区域的高度
    this.dropZone.width = this.blockContainer.height = this._block.displayWidth;
    this.dropZone.height = this.blockContainer.height =
      this._block.height - this._block.topHeight;
    this.dropZone.updateHitArea();
    // this.g
    //   .clear()
    //   .fillStyle(0xff0000, 0.5)
    //   .fillRect(
    //     this.dropZone.x,
    //     this.dropZone.y,
    //     this.dropZone.width,
    //     this.dropZone.height
    //   );
  }
  /**
   * 更新放置区域的大小和校准位置
   * @param scale
   */
  private updateDropAreaScaleAndPosition(scale: number) {
    this.dropZone.setScale(scale);
    this.blockContainer.setScale(scale);
    const marginTop = this._block.displayHeight - this._block.height;
    this.blockContainer.setPosition(
      this._block.x,
      this._block.topHeight - marginTop / 2
    );
    this.dropZone.setX(this._block.x);
  }
  /**
   * @override
   * @param scale
   * @param isTween
   * @param duration
   */
  setBlockScale(scale, isTween = false, duration = 100) {
    this.scaleTween && this.scaleTween.isPlaying() && this.scaleTween.stop();
    const x = (this.width - this.width * scale) / 2;
    const y = (this.height - this.height * scale) / 2;
    if (isTween) {
      this.scaleTween = this.scene.add.tween({
        targets: this._block,
        scale,
        x,
        y,
        duration,
        onUpdate: () => {
          this.showParamSelect && this.scaleParamZone(this._block.scale);
          this.updateDropAreaScaleAndPosition(scale);
        },
        onComplete: () => {
          this.updateHitArea();
          this.updateDropAreaScaleAndPosition(scale);
        },
      });
    } else {
      this._block.setScale(scale);
      this._block.setPosition(x, y);
      this.showParamSelect && this.scaleParamZone(scale);
      this.updateHitArea();
      this.updateDropAreaScaleAndPosition(scale);
    }
    return this; //子类调用,返回的是子类的this
  }
  /**
   * @override
   * 更新被拖拽的位置大小
   */
  updateHitArea() {
    this.input &&
      setTimeout(() => {
        this.input.hitArea.setPosition(
          (this.width - this._block.displayWidth) / 2 + this.width / 2,
          (this.height - this._block.displayHeight + this.raisedHeight) / 2 +
            this.height / 2
        );
        this.input.hitArea.setSize(
          this._block.displayWidth,
          this._block.topHeight
        );
      }, 0);
  }
  /**
   * 缩放参数区域
   * @param scale
   */
  scaleParamZone(scale) {
    this.paramZone.setScale(scale);
    this.paramText.setScale(scale);
    this.paramZone.x = this.paramText.x =
      (this.width - this.paramZone.displayWidth) / 2 +
      blockParamConfigX * scale;
    // 根据这个block调整
    this.paramZone.y = this.paramText.y =
      (this.height -
        this._block.midScaleY * scale -
        this.paramZone.displayHeight) /
        2 -
      blockParamConfigY * scale;
  }
  /**
   * @override
   * 切换到选中的纹理
   */
  setBlockSelected(isSelect: boolean) {
    this._block.setSelected(isSelect);
    if (isSelect && !this.isSelect) {
      this._block.x -= 4;
      this._block.y -= 4;
      this.isSelect = true;
      this.parentContainer && this.parentContainer.bringToTop(this);
    } else if (!isSelect && this.isSelect) {
      this._block.x += 4;
      this._block.y += 4;
      this.isSelect = false;
    }
  }
}

class Block extends Phaser.GameObjects.Container {
  private whileTop: Phaser.GameObjects.Image;
  private whileMid: Phaser.GameObjects.Image;
  private whileBottom: Phaser.GameObjects.Image;
  private _raisedHeight;
  constructor(scene: Phaser.Scene, raisedHeight) {
    super(scene, 0, 0);
    this._raisedHeight = raisedHeight != undefined ? raisedHeight : 10;
    this.whileTop = scene.add
      .image(0, 0, "blockly_block_while_top")
      .setOrigin(0, 0);
    this.whileMid = scene.add
      .image(0, this.whileTop.height, "blockly_block_while_mid")
      .setOrigin(0, 0)
      .setScale(1, 0);
    this.whileBottom = scene.add
      .image(
        0,
        this.whileTop.height + this.whileMid.displayHeight,
        "blockly_block_while_bottom"
      )
      .setOrigin(0, 0);
    this.width = this.getWidth();
    this.height = this.getHeight();
    this.add([this.whileTop, this.whileMid, this.whileBottom]);
  }

  get raisedHeight() {
    return this._raisedHeight * this.scale;
  }
  get topHeight() {
    return 89 * this.scale;
  }
  get midMinHeight() {
    return 65 * this.scale;
  }
  get midWidth() {
    return 19 * this.scale;
  }
  get bottomHeight() {
    return 34 * this.scale;
  }
  get midScaleY() {
    return this.whileMid.scaleY;
  }
  setSelected(bool: boolean) {
    if (bool) {
      this.whileTop.setTexture(this.whileTop.texture.key + "_select");
      this.whileMid.setTexture(this.whileMid.texture.key + "_select");
      this.whileBottom.setTexture(this.whileBottom.texture.key + "_select");
    } else {
      this.whileTop.setTexture(
        this.whileTop.texture.key.replace("_select", "")
      );
      this.whileMid.setTexture(
        this.whileMid.texture.key.replace("_select", "")
      );
      this.whileBottom.setTexture(
        this.whileBottom.texture.key.replace("_select", "")
      );
    }
  }
  /**
   * block的中间部分利用缩放改变高度
   * @param height
   */
  updateMidHeight(height) {
    this.whileMid.setScale(
      1,
      Math.max(0, height - this.midMinHeight + this.raisedHeight)
    );
    this.whileBottom.setY(this.whileTop.height + this.whileMid.displayHeight);
  }
  /**
   * 被缩放后，改变自己的坐标，达到缩放源点为中心点的目的
   */
  updatePositionAfterScale() {
    this.x = (this.width - this.displayWidth) / 2;
    this.y = (this.height - this.displayHeight) / 2;
  }
  updateHeight() {
    this.height = this.getHeight();
  }
  private getHeight() {
    return (
      this.whileTop.height +
      this.whileMid.displayHeight +
      this.whileBottom.height
    );
  }
  private getWidth() {
    return Math.max(
      this.whileTop.width,
      this.whileMid.displayWidth,
      this.whileBottom.width
    );
  }
}
