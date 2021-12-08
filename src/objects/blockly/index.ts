import BaseBlock from "./blocks/baseBlock";
import RunPanel from "./runPanel/index";
import BlockPond from "./blockPond/index";
import Blocks from "./blocks/index";
import InfiniteBlockContainer from "./infiniteBlockContainer";
export default class ClassBlockly {
  private _blockList: Array<
    Blockly.BaseBlockInstance | InfiniteBlockContainer
  > = [];
  private _runPanel: Blockly.RunPanel;
  private selectedBlockList: Blockly.BaseBlockInstance[] = [];
  constructor(param: Blockly.BlocklyParam) {
    const infiniteBlock = !!param.infiniteBlock; //是否全部block都是无限块
    param.blocks.forEach((item) => {
      const isInfinite =
        item.isInfinite === undefined ? infiniteBlock : item.isInfinite; //单独的块是否是无限块
      const Block = Blocks[item.name];
      if (!Block) {
        console.error(item.name + "不存在");
        return;
      }
      const block = new Block({
        scene: param.scene,
        theme: param.theme,
        paramList: item.paramList,
        isInfinite,
      });
      this._blockList.push(
        isInfinite
          ? new InfiniteBlockContainer({
            scene: param.scene,
            child: block,
          })
          : block
      );
    });
    this._runPanel = <Blockly.RunPanel>new RunPanel[param.theme]({
      scene: param.scene,
      cb: param.runPanel ? param.runPanel.cb : undefined,
    }).setDepth(param.depth || 1);
    <Blockly.BlockPond>new BlockPond[param.theme]({
      scene: param.scene,
      children: this._blockList,
      initScale: param.blockPond ? param.blockPond.initScale : undefined,
    }).setDepth(param.depth || 1);
    // param.scene.add.existing(
    //   new RunPanel({
    //     scene: param.scene,
    //     y:0,
    //     x:200
    //   })
    // );'
    // console.log(this.constructor.name)
  }
  get runPanel(): Blockly.RunPanel {
    return this._runPanel;
  }
  get blockList(): Array<Blockly.BaseBlockInstance | InfiniteBlockContainer> {
    return this._blockList;
  }
  // 所以有的block(包括无限block新产生的block)
  private get allBlocks(): any[] {
    return this._blockList
      .map((item: Blockly.BaseBlockInstance | InfiniteBlockContainer) => {
        if (item.id === InfiniteBlockContainer.id) {
          return (<InfiniteBlockContainer>item).blockChildren;
        }
        return item;
      })
      .flat();
  }
  selectBlock(blockId: string) {
    const target = this.allBlocks.find(
      (block: BaseBlock) => block.id === blockId
    );
    if (target) {
      this.selectedBlockList.push(target);
      target.setBlockSelected(true);
    }
  }
  unSelectBlock(blockId?: string) {
    if (blockId) {
      const index = this.selectedBlockList.findIndex(
        (block: Blockly.BaseBlockInstance) => block.id === blockId
      );
      if (index > -1) {
        const target = this.selectedBlockList.splice(index, 1);
        target[0].setBlockSelected(false);
      }
    } else {
      while (this.selectedBlockList.length > 0) {
        this.selectedBlockList.shift().setBlockSelected(false);
      }
    }
  }
  // 递归解析Blockly的指令块
  static parseBlockList(
    l: Blockly.CodeItem[],
    parentIds = []
  ): Blockly.RunItem[] {
    const list = [];
    l.forEach((item: Blockly.CodeItem) => {
      const result = eval(item.codeStr); //改为静态方法后，由于没有this.role，报错了
      if (typeof result == "function") {
        list.push({
          blockId: item.blockId,
          func: result,
          parentIds,
        });
      } else if (Array.isArray(result)) {
        list.push(...ClassBlockly.parseBlockList.bind(this)(result, [...parentIds, item.blockId,]));
      }
    });
    return list;
  }
}
