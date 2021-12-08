/**
 * @file 指令块类型
 */

/**
 * block的基类类型声明
 */
declare namespace Blockly {
  type CodeItem = {
    blockId: string;
    codeStr: string;
    children?: CodeItem[];
  };
  type RunItem = { blockId: string; func: () => void; parentIds: string[] };

  interface BaseBlockInstance
    extends Phaser.GameObjects.Container,
      InfiniteBlockInterface {
    // 实例属性
    // id: string;
    code: CodeItem;
    blockName: string;
    indicatorLigthTexture: string;
    block: Phaser.GameObjects.Image | Phaser.GameObjects.Container | any;
    currentScene: Phaser.Scene;
    isSelect: boolean;
    placeholderTextureKey: string;
    originContainer:
      | BlockPond
      | Phaser.GameObjects.Container
      | InfiniteBlockContainer;
    moveToPosition: (
      position: { x: number; y: number },
      duration?: number
    ) => Phaser.GameObjects.Container;
    setBlockSelected(isSelect: boolean): void;
    setBlockScale(scale: number, isTween?: boolean, duration?: number): this;
  }
  interface BaseBlockStatic extends Phaser.GameObjects.Container {
    new (param: BlockParams): BaseBlockInstance;
    // 静态属性
  }
  interface BaseBlock extends BaseBlockStatic {}
  // class BaseBlock extends Phaser.GameObjects.Container implements Blockly.InfiniteBlockInterface {

  // }

  /**
   * 单个block的参数
   */
  type BlockParams = {
    scene: Phaser.Scene;
    theme?: string;
    paramList?: any[];
    isInfinite: boolean; //是否可无限拖拽
  };
  /**
   * block基础参数
   */
  type BaseDropParams = {
    scene: Phaser.Scene;
    x: number;
    y: number;
    // id:string;
  };

  /**
   * runPanel中放置的区域
   */
  class Drop extends Phaser.GameObjects.Zone {
    dragenterBlock(
      block: Blockly.BaseBlock | Phaser.GameObjects.Container
    ): void;
    dragoverBlock(
      block: Blockly.BaseBlock | Phaser.GameObjects.Container,
      placeholderTextureKey: string
    ): void;
    dragleaveBlock(
      block: Blockly.BaseBlock | Phaser.GameObjects.Container
    ): void;
    dropBlock(block: Blockly.BaseBlock | Phaser.GameObjects.Container): void;
  }

  class BlockContainer extends Phaser.GameObjects.Container {
    layoutDropRect(filter?: any): void;
    dragenterBlock(
      block: Blockly.BaseBlock | Phaser.GameObjects.Container
    ): void;
    dragoverBlock(
      block: Blockly.BaseBlock | Phaser.GameObjects.Container,
      placeholderTextureKey: string
    ): void;
    dragleaveBlock(
      block: Blockly.BaseBlock | Phaser.GameObjects.Container
    ): void;
    dropBlock(block: Blockly.BaseBlock | Phaser.GameObjects.Container): void;
  }
  type BlocklyParam = {
    scene: Phaser.Scene;
    x?: number;
    y?: number;
    depth?: number;
    infiniteBlock?: boolean;
    blocks: Array<{
      name: string;
      paramList: any[];
      isInfinite?: boolean;
    }>;
    theme?: string;
    blockPond?: {
      initScale?: number;
    };
    runPanel: {
      cb?: RunPanelCallBack;
    };
  };

  type RunPanelCallBack = {
    onRun?: (codeList: Array<CodeItem>) => void;
  };
  type RunPanelTextures = {
    blockPond_bg: string;
    runPanel_bg: string;
    play_btn: string;
    play_btn_focus: string;
    indicator_close: string;
    drop_bg: string;
    scroll_bar: string;
    slider: string;
    drop_bg_raised: string;
  };
  type BaseRunPanelParam = {
    textures: RunPanelTextures;
  } & RunPanelParam;

  type RunPanelParam = {
    scene: Phaser.Scene;
    x?: number;
    y?: number;
    depth?: number;
    cb: RunPanelCallBack;
  };
  class RunPanel extends Phaser.GameObjects.Container {
    public blockContainer: BlockContainer;
    constructor(param: RunPanelParam);
    public runEnd();
    public run();
  }

  interface InterfaceBlockPond {
    resetBlock(block: Phaser.GameObjects.Container): void;
  }

  class BlockPond
    extends Phaser.GameObjects.Container
    implements InterfaceBlockPond
  {
    resetBlock(
      block: Phaser.GameObjects.Container,
      isTween?: boolean,
      isInfinite?: boolean
    ): void;
  }

  type BaseBlockPondParam = {
    textures: RunPanelTextures;
    initScale?: number;
  } & BlockPondParam;

  type BlockPondParam = {
    scene: Phaser.Scene;
    x?: number;
    y?: number;
    children: Phaser.GameObjects.Container[];
  };
  interface InfiniteBlockInterface {
    id: string;
    setOriginContainer(c: Blockly.BlockPond): this;
    setBlockScale(scale: number, isTween?: boolean, duration?: number): this;
    addAt(
      child: Phaser.GameObjects.GameObject | Phaser.GameObjects.GameObject[],
      index?: number
    ): this;
  }
  class InfiniteBlockContainer
    extends Phaser.GameObjects.Container
    implements Blockly.InfiniteBlockInterface, Blockly.InterfaceBlockPond
  {
    id: string;
    blockChildren: BaseBlock[];
    resetBlock(block: Phaser.GameObjects.Container): void;
    setOriginContainer(c: Blockly.BlockPond): this;
    setBlockScale(scale: number, isTween?: boolean, duration?: number): this;
    addAt(child: Blockly.BaseBlock, index?: integer): this;
    removeChild(blockId: string): void;
  }
}
