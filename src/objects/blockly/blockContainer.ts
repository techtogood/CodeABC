/**
 * 存放block的容器
 */
import { getRect } from "@/utils/index";
import ScrollBar from "./scrollBar";
type BlockContainerParam = {
  scene: Phaser.Scene;
  x: number;
  y: number;
  width: number;
  height: number;
  showScrollBar?: boolean;
  scrollBarTexture?: { scrollBar: string; slider: string };
};
export default class BlockContainer extends Phaser.GameObjects.Container {
  private placeholder: Phaser.GameObjects.Container;
  private scrollBar: ScrollBar;
  private scrollTop = 0;
  private scrollTopOffectY = 0;
  OFFECT_Y = 4;
  OFFECT_X = 4;
  showScrollBar = true;
  constructor(param: BlockContainerParam) {
    super(param.scene, param.x, param.y);
    this.scrollTopOffectY = param.y;
    this.showScrollBar = param.showScrollBar;
    this.setSize(param.width, param.height);
    this.showScrollBar && this.createScrollBar(param.scrollBarTexture);
  }
  // dropRect是否溢出
  private get isDropRectOverflow() {
    return this.dropRectScrollHeight > this.height;
  }
  // dropRect的children的总高度
  private get dropRectScrollHeight() {
    return (
      this.getAll().reduce((prev, current: Blockly.BaseBlock) => {
        return prev + current.displayHeight;
      }, 0) + 50
    ); //底部预留50的高度
  }
  /**
   * 创建滚动条
   */
  private createScrollBar(texture: { scrollBar: string; slider: string }) {
    setTimeout(() => {
      this.scrollBar = new ScrollBar({
        scene: this.scene,
        x: this.x + this.width + 36,
        y: this.y + 26,
        onScroll: (scrollTop) => {
          if (this.isDropRectOverflow) {
            this.scrollTop = scrollTop;
            this.y =
              (this.height - this.dropRectScrollHeight) * scrollTop +
              this.scrollTopOffectY;
          }
        },
        texture,
      });
      this.scrollBar.setVisible(false);
      this.parentContainer.add(this.scrollBar);
      // 通过mask生成超出隐藏的容器，需要等所有父容器实例化后再生成，因为需要获取this基于scene的坐标
      const rect = getRect(this);
      var graphics = this.scene.make.graphics(
        {
          x: rect.left, //需要基于scene定位，而不是父容器（是bug还是???待验证）
          y: rect.top,
        },
        false
      );
      // this.add(graphics);
      graphics
        // .fillStyle(0x000000, 0.3)
        .fillRectShape(
          new Phaser.Geom.Rectangle(0, 0, this.width + 10, this.height)//this.width+10是加长宽度10，避免block的右侧被隐藏一点点
        );
      var mask = new Phaser.Display.Masks.GeometryMask(this.scene, graphics);
      this.setMask(mask);
    }, 0);
  }
  /**
   * 更新y坐标和滚动条的显示与否
   */
  private updateScrollBar() {
    if (this.isDropRectOverflow) {
      this.y =
        (this.height - this.dropRectScrollHeight) * this.scrollTop +
        this.scrollTopOffectY;
    } else {
      this.y = this.scrollTopOffectY;
    }
    this.scrollBar.setVisible(this.isDropRectOverflow);
  }
  /**
   * 为子元素的Y轴方向上排列布局
   * @param filter
   */
  public layoutDropRect(filter = undefined) {
    let y = this.OFFECT_Y;
    const c = this.getAll().filter((item) => item !== filter);
    c.forEach((item: Blockly.BaseBlock, index) => {
      item.setDepth(index + 1);
      item.setPosition(this.OFFECT_X, y);
      y += item.height;
    });
  }
  /**
   * 销毁占位符
   */
  private destroyPlaceholder() {
    if (this.placeholder) {
      this.placeholder.destroy();
      this.placeholder = null;
    }
  }
  /**
   *  获取插入drop的索引
   */
  private getInsertDropIndex(block, isFilter = false) {
    const children = <Array<Blockly.BaseBlock>>this.sort("y")
      .getAll()
      .filter((item) => !isFilter || item !== block); //bug:getAll返回的顺序有时候不一样??
    if (children.length === 0) return 0;
    let insertIndex = children.length;
    const rect = getRect(this);
    const pointerYInDropRect = Math.floor(
      this.scene.input.activePointer.y - rect.top
    ); // 根据指针寻找Y轴方向的索引
    for (let i = 0; i < children.length; i++) {
      if (
        pointerYInDropRect > children[i].y &&
        pointerYInDropRect <= children[i].y + children[i].height
      ) {
        insertIndex = i;
        break;
      }
    }
    // 避免被插队的block高度远远大于当前选中的block触发的不断切换插入位置的情况
    const y = this.scene.input.activePointer.y - rect.top;
    if (
      children[insertIndex] &&
      y >= children[insertIndex].y &&
      y + block.height <=
      children[insertIndex].y + children[insertIndex].height &&
      this.placeholder // 这个判断是为了从嵌套的block移出block时没有显示插入位置的问题
    ) {
      return -1; //表示取消终止插入（排队）操作
    }
    return insertIndex;
  }

  /**
   *  进入放置区域
   * @param block
   */
  dragenterBlock(block: Blockly.BaseBlock) { }
  /**
   * 在放置区域移动，实现外部插入，内部排队
   * @param block
   * @param placeholderTextureKey
   */
  dragoverBlock(block: Blockly.BaseBlock, placeholderTextureKey: string) {
    //插队
    const insertIndex = this.getInsertDropIndex(block);
    if (insertIndex < 0) return;
    if (this.placeholder) {
      // 调整插入位置
      const swapTarget = this.getAt(insertIndex);
      if (swapTarget && swapTarget !== this.placeholder) {
        this.swap(swapTarget, this.placeholder);
        this.layoutDropRect(block);
      }
    } else {
      // 找到插入位置
      this.placeholder = this.scene.add.container(0, 0);
      this.placeholder.height = block.height;
      this.placeholder.width = block.width;
      // 占位图
      this.scene.textures.exists(placeholderTextureKey) &&
        this.placeholder.add(
          this.scene.add.image(-4, -4, placeholderTextureKey).setOrigin(0, 0)
        );
      this.addAt(this.placeholder, insertIndex);
      this.layoutDropRect(block); //，则调整插入placeholder后容器内元素的坐标
    }
    this.placeholder.setData("insertIndex", insertIndex);
    this.bringToTop(block);
    // 根据占位block是否被遮挡，进行滚动条的调整
    if (this.showScrollBar && this.isDropRectOverflow) {
      const placeholderRect = getRect(this.placeholder)
      const rect = getRect(this)
      const discrepantY = this.scrollTopOffectY - this.y
      if (placeholderRect.top < rect.top + discrepantY) {
        this.scrollBar.scrollToTop()
      }
      if (placeholderRect.bottom > rect.bottom + discrepantY) {
        this.scrollBar.scrollToBottom()
      }
    }
    setTimeout(() => {
      // 在runPanel内选中拖拽时，需要将updateScrollBar放到下一轮事件循环（先emit其它事件，使被移动的block移除，才开始计算滚动条）
      this.showScrollBar && this.updateScrollBar();
    });
  }
  /**
   * 离开放置区域
   * @param block
   */
  dragleaveBlock(block: Blockly.BaseBlock) {
    this.destroyPlaceholder();
    this.layoutDropRect();
    this.showScrollBar && this.updateScrollBar();
  }
  /**
   * 在放置区域后松开block（注意：要是原来就在放置区域，phaser则不会触发事件，这种情况做了手动emit的处理）
   * @param block
   */
  dropBlock(block: Blockly.BaseBlock) {
    if (this.placeholder) {
      this.scene.musicManager.play("click_2");
      // 因为placeholderContainer被置顶了,所以需要获取真实的插入位置插入block
      const insertIndex = this.placeholder.getData("insertIndex");
      if (this.exists(block)) {
        // 内部排序
        this.moveTo(block, insertIndex);
      } else {
        // 新插入
        insertIndex < this.length && this.moveTo(this.placeholder, insertIndex);
        this.replace(this.placeholder, block);
      }
      // if (insertIndex >= this.getAll().length - 1 && this.isDropRectOverflow) {
      //   this.scrollBar.scrollToBottom()
      // }
      // if (insertIndex ==0 && this.isDropRectOverflow) {
      //   this.scrollBar.scrollToTop()
      // }
      this.destroyPlaceholder();
      this.layoutDropRect();
    }
  }
}
