/**
 * @flie block的基类
 */
import { createId, getRect } from "@/utils/index";
import NumberParamBubbleBox from "../numberParamBubbleBox";
const RAISED_HEIGHT = 10; //block 凸出的高度
const ParamZoneWidth = 74; //参数交互区域的宽度
const ParamZoneHeight = 42; //参数交互区域的高度
const DragstartScale = 1.4; //拖拽时的缩放比例
const DropScale = 1; //放置到放置区域后的缩放比例
type Block = Phaser.GameObjects.Container | Phaser.GameObjects.Image | string;
type BlockParamConfig = {
  x: number;
  y: number;
  list: Array<any>;
};
interface Params extends Blockly.BlockParams {
  block: Block; //渲染的纹理或游戏对象
  raisedHeight?: number; //方块凸出的高度
  blockParamConfig?: BlockParamConfig; // 可以选择参数的block
}
export default abstract class BaseBlock<T = any>
  extends Phaser.GameObjects.Container
  implements Blockly.InfiniteBlockInterface {
  readonly id = createId(); // 唯一id
  protected ParamZoneWidth = ParamZoneWidth; // 参数区域的宽度
  protected ParamZoneHeight = ParamZoneHeight; //参数区域的高度
  protected _block: Phaser.GameObjects.Container | Phaser.GameObjects.Image | T | any; //这个容器中的渲染纹理
  public originContainer: Blockly.BlockPond; //默认（初始）放置block的区域
  protected showParamSelect: boolean; //是否显示参数选择
  protected paramZone: Phaser.GameObjects.Zone; //参数区域的交互空间
  protected paramText: Phaser.GameObjects.Text; //参数区域的显示文字
  protected scaleTween: Phaser.Tweens.Tween; // 拖动时放的tween
  protected moveToTween: Phaser.Tweens.Tween; // 拖动时放的tween
  protected raisedHeight: number = RAISED_HEIGHT; //block中凸出的高度
  protected isSelect: boolean; //是否在选中状态
  protected placeholderType = "placeholder_1"; //放置时，显示在放置区域的占位纹理的类型
  protected theme: string; //主题（例如：theme_1）
  protected blockParamConfig: BlockParamConfig; //参数区域的配置
  private isDrop: boolean = false; //是否已经被放置
  protected param: Params;
  private __proto__: any;
  constructor(param: Params) {
    super(param.scene);
    const {
      block,
      raisedHeight = RAISED_HEIGHT,
      blockParamConfig,
      theme = "theme_1",
    } = (this.param = param);
    this.theme = theme;
    this.raisedHeight = raisedHeight;
    this._initBlock(block)
      .setSize(this._block.width, this._block.height - raisedHeight) //设置容器的宽高度，用户拖拽交互
      ._initDragEvent()
      .setDepth(1000)
      .scene.add.existing(this);
    blockParamConfig &&
      blockParamConfig.list &&
      blockParamConfig.list.length > 0 &&
      this.createBlockParam(blockParamConfig);
    // const g = this.scene.add.graphics();
    // g.fillStyle(0xff0000, 0.5).fillRect(
    //   this.x,
    //   this.y,
    //   this.width,
    //   this.height
    // );
    // this.add(g);
  }
  protected get blockName() {
    return this.__proto__.constructor.blockName; //从静态属性获取相关属性
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
    this.paramZone
      .setInteractive()
      .on(
        "pointerdown",
        (
          pointer: Phaser.Input.Pointer,
          localX: number,
          localY: number,
          event: Phaser.Types.Input.EventData
        ) => {
          setTimeout(() => this.showBubbleBox(config.list)); //先执行pointerdown事件关闭其它参数选择，在显示参数选择);
          // event.stopPropagation();
        }
      );

    const defaultSelectParam = config.list && config.list ? config.list[0] : ""; //首个参数值为默认参数
    this.add(this.paramZone);

    // 参数
    this.paramText = this.scene.add.text(x, y, defaultSelectParam.toString(), {
      fontSize: "40px",
      fontFamily: "PuHuiTi",
      color: "#FFFFFF",
      fixedWidth: this.ParamZoneWidth,
      fixedHeight: this.ParamZoneHeight, // 40px的字体时获取到的渲染高度是50
      align: "center",
      // backgroundColor: "rgba(0,0,0,0.3)",
      baselineY: 0.15,
    });
    this.add(this.paramText);
    this.showParamSelect = true;
  }
  /**
   *  跟新显示的参数
   * @param param
   */
  protected updateText(param) {
    this.paramText.setText(param);
  }
  /**
   * 显示选择参数的气泡框
   */
  protected showBubbleBox(paramList) {
    if (paramList.length < 2) return;
    this.scene.musicManager.play("click");
    this.setBlockSelected(true);
    const { left, top } = getRect(this.paramZone);
    const bubbleBox = new NumberParamBubbleBox({
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

  /**
   * 初始化拖拽事件
   */
  private _initDragEvent() {
    this.setInteractive().input.hitArea.setPosition(
      this.width / 2,
      this.height / 2
    );
    let offectX = 0,
      offectY = 0;
    this.on("drag", (pointer, dragX, dragY) => {
      this.x = dragX + offectX;
      this.y = dragY + offectY;
    })
      .on("dragstart", (pointer: Phaser.Input.Pointer, dragX2, dragY2) => {
        // this.scaleTween &&
        //   this.scaleTween.isPlaying() &&
        //   this.scaleTween.stop();
        //   this.moveToTween &&
        //   this.moveToTween.isPlaying() &&
        //   this.moveToTween.stop();
        this.setDepth(1001).setBlockScale(DragstartScale, true, 50);
        /**
         * 复制一个block,在相同的位置放置
         */
        this.param.isInfinite &&
          this.parentContainer === this.originContainer &&
          this.copy();
        if (this.parentContainer) {
          // 这里是在被放置后，再次拖动，需要在remove前再这个块的位置补充placeholder的情况（待优化）
          if (
            this.parentContainer != this.originContainer &&
            (<Blockly.BlockContainer>this.parentContainer).dragoverBlock
          ) {
            this.setData("isDrop", true).setData(
              "prevParentContainer",
              this.parentContainer
            );
            (<Blockly.BlockContainer>this.parentContainer).dragoverBlock(
              this,
              this.placeholderTextureKey
            );
          }
          this.parentContainer.remove(this);
          this.scene.add.existing(this);
          const x = pointer.x - this.input.localX + this.width / 2;
          const y = pointer.y - this.input.localY + this.height / 2;
          offectX = x - this.x;
          offectY = y - this.y;
          this.x = x;
          this.y = y;
        }
      })
      .on("dragend", (pointer, dragX, dragY, isDrop) => {
        offectX = offectY = 0;
        this.setDepth(1000);
        //没有被放置，则回到源容器(先触发drop event)
        this.parentContainer &&
          this.parentContainer != this.originContainer &&
          this.setBlockScale(DropScale);
        if (this.showParamSelect) {
          // 重复放置，则不显示气泡框（只有从originContainer放置到runPanel，才显示参数选择）
          const prevIsDrop = this.isDrop;
          !prevIsDrop &&
            isDrop &&
            this.showBubbleBox(this.blockParamConfig.list);
        }
        this.isDrop = isDrop;
        // 处理选择block，但是没有拖拽，导致emit不到drop事件的问题
        if (!isDrop && this.getData("isDrop")) {
          // 仅仅触发dragstart但是没有移动，导致isDrop为false，则需要手动emit事件
          const prevParentContainer = this.getData("prevParentContainer");
          prevParentContainer &&
            this.emit("drop", pointer, prevParentContainer);
          this.setBlockScale(DropScale);
        } else {
          // 真的没有被放置，则回到originContainer，并更新originContainer的布局
          this.originContainer &&
            this.originContainer.resetBlock(this, pointer.getDuration() > 300); // pointer.getDuration():拖动的时间,避免快速点击block导致block的位置异常（主要是因为tween动画未完成导致的）
        }
      })
      .on("dragenter", (pointer, target: Blockly.Drop) => {
        this.setData("isDrop", true);
        target.dragenterBlock(this);
      })
      .on("drop", (pointer, target: Blockly.Drop) => {
        target.dropBlock(this);
      })
      .on("dragover", (pointer, target: Blockly.Drop) => {
        target.dragoverBlock(this, this.placeholderTextureKey);
      })
      .on("dragleave", (pointer, target: Blockly.Drop) => {
        this.setData("isDrop", false);
        target.dragleaveBlock(this);
      });
    this.scene.input.setDraggable(this, true);
    return this;
  }
  /**
   * 根据参数类型，绑定或创建纹理
   * @param block
   */
  private _initBlock(block: Block) {
    this._block =
      typeof block === "string"
        ? this.scene.add.image(0, 0, block).setOrigin(0, 0)
        : block;
    this.add(this._block);
    return this;
  }
  /**
   * 占位容器显示的纹理
   */
  public get placeholderTextureKey() {
    return `blockly_${this.theme}_runPanel_${this.placeholderType}`;
  }
  abstract get code(): { blockId: string; codeStr: string };
  /**
   * 记录源容器，用于没有被放置时，回到的地方
   */
  public setOriginContainer(c: Blockly.BlockPond) {
    this.originContainer = c;
    return this;
  }
  /**
   * 对纹理的Gameobject进行缩放
   * 注意：仅仅是本容器内的children缩放了，容器本身的尺寸并没有缩放
   * @param scale 缩放比例
   * @param isTween 是否使用补间动画进行缩放
   */
  public get blockScale() {
    return this._block.scale;
  }
  public moveToPosition(position: { x: number; y: number }, duration = 0) {
    this.moveToTween = this.scene.add.tween({
      targets: this,
      ...position,
      duration,
    });
    return this;
  }
  public setBlockScale(scale, isTween = false, duration = 100) {
    this.scaleTween && this.scaleTween.isPlaying() && this.scaleTween.stop();
    this.moveToTween && this.moveToTween.isPlaying() && this.moveToTween.stop();
    const x = (this.width - this.width * scale) / 2;
    const y = (this.height - this.height * scale) / 2;
    if (isTween) {
      this.scaleTween = this.scene.add.tween({
        targets: this._block,
        scale,
        x,
        y,
        duration,
        onUpdate: () =>
          this.showParamSelect && this.scaleParamZone(this._block.scale),
        onComplete: () => this.updateHitArea(),
      });
    } else {
      this._block.setScale(scale);
      this._block.setPosition(x, y);
      this.showParamSelect && this.scaleParamZone(scale);
      this.updateHitArea();
    }
    return this; //子类调用,返回的是子类的this
  }
  /**
   * 缩放参数区域
   * @param scale
   */
  public scaleParamZone(scale) {
    this.paramZone.setScale(scale);
    this.paramZone.x =
      (this.width - this.paramZone.displayWidth) / 2 +
      this.blockParamConfig.x * scale;
    this.paramZone.y =
      (this.height - this.paramZone.displayHeight) / 2 -
      this.blockParamConfig.y * scale;
    if (this.paramText) {
      this.paramText.setScale(scale);
      this.paramText.x = this.paramZone.x;
      this.paramText.y = this.paramZone.y;
    }
  }
  /**
   * 更新交互区域
   */
  public updateHitArea() {
    if (!this.input) return;
    this.input.hitArea.setPosition(
      (this.width - this._block.displayWidth) / 2 + this.width / 2,
      (this.height - this._block.displayHeight + this.raisedHeight) / 2 +
      this.height / 2
    );
    this.input.hitArea.setSize(
      this._block.displayWidth,
      this._block.displayHeight - this.raisedHeight
    );
  }
  /**
   * 切换到选中的纹理
   */
  public setBlockSelected(isSelect: boolean) {
    if (isSelect && !this.isSelect) {
      const _block = this._block as Phaser.GameObjects.Image;
      _block.setTexture(_block.texture.key + "_select");
      this.isSelect = true;
      _block.x -= 4;
      _block.y -= 4;
      this.parentContainer && this.parentContainer.bringToTop(this);
    } else if (!isSelect && this.isSelect) {
      const _block = this._block as Phaser.GameObjects.Image;
      _block.setTexture(_block.texture.key.replace("_select", ""));
      _block.x += 4;
      _block.y += 4;
      this.isSelect = false;
    }
  }
  protected copy() {
    const { scene, theme, blockParamConfig, isInfinite } = this.param;
    const param: Blockly.BlockParams = {
      scene,
      theme,
      paramList: blockParamConfig && blockParamConfig.list,
      isInfinite: isInfinite,
    };
    const c = new this.__proto__.constructor(param);
    c.setBlockScale(this.blockScale);
    this.parentContainer.addAt(c, 0);
    c.setOriginContainer(<any>this.parentContainer);
  }
}
