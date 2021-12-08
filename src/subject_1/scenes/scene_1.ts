/**
 * @file 拼图游戏场景一
 * 游戏逻辑：
 * 1.通过init接收关卡配置levelConfig
 * 2.读取levelConfig中的配置，渲染对应的图片（拼图块）
 * 3.当拼图块被移动到卡槽（场景中间的位置）， 通过 setData("fillIndex", *)记录放置的顺序
 * 4.当blockList中fillIndex的值不为-1的拼图块数量为3时，根据levelConfig.data.answer提供的正确顺序对比拼图块的fillIndex，得出是否完成游戏
 * 5.完成游戏则显示结算画面
 * 6.拼图块顺序不对则撤回上一操作，并摇晃提示板，继续游戏直到顺序正确
 */
import BackBtn from "@/objects/backBtn";
import ScoreBoard from "@/objects/scoreBoard";
import RewardDialog from "@/objects/rewardDialog";
import ExitLevelDialog from "@/objects/exitLevelDialog";
import LevelPanel from "@/objects/levelPanel";
import { asyncTween, shuffle2Array, sleep } from "@/utils";
const BLOCK_WIDTH = 536; //方块宽度
const BLOCK_HEIGHT = 143; //方块高度
const CONVEX_HEIGHT = 38; //方块凸出的高度
const TOUCH_TIME = 0; //长按时间
const SCALE = 0.724; //方块在存放区域中的缩放比例
const MARGIN_LEFT = 50; //方块在存放区域之间的间距
const TWEEN_DURATION = 300;
export default class Subject_1_Scene_1 extends Phaser.Scene {
  blockList: Array<Phaser.GameObjects.Container> = []; //可拖拽的方块
  blockBgList: Array<Phaser.GameObjects.Container> = []; //方块拖拽的目的地
  deleteBtn: Phaser.GameObjects.Image; // 删除方块的按钮
  blockContainerImage: Phaser.GameObjects.Image;
  layoutBlockContainerTimeId: number;
  scoreBoard: ScoreBoard;
  cueBoard: Phaser.GameObjects.Image;
  levelConfig: Game.LevelConfigs;
  constructor() {
    super("Subject_1_Scene_1");
  }
  init({ levelConfig }) {
    this.levelConfig = levelConfig;
  }
  create() {
    console.log(this.scene.key);
    if (!this.levelConfig) return console.error("level_config 数据有误");
    // 初始化游戏场景
    this.initScene();
    this.createBlockSelectContainer();
    this.createBlockPlace();
    const isFinish = false; //&& levelStorageData&&levelStorageData.isFinish;
    const filled = this.levelConfig.data[isFinish ? "answer" : "filled"];
    !isFinish && this.createBlockDrag();
    this.presetFill(filled);
    this.layoutBlockContainer();
  }
  update() {}
  /**
   * 初始化场景素材
   */
  initScene() {
    this.add.image(
      +this.game.config.width / 2,
      +this.game.config.height / 2,
      this.levelConfig.bg
    );
    new LevelPanel({
      scene: this,
      level: this.levelConfig.level,
      texture: "subject_1_level_level_panel_bg",
    });

    // 左上角的返回按钮
    new BackBtn({
      scene: this,
      pointerup: () =>
        new ExitLevelDialog({
          scene: this,
          level: this.levelConfig.level,
          onExit: () => this.router.back(),
        }),
    });
    // 金币计算面板
    this.scoreBoard = new ScoreBoard({
      scene: this,
    });
    // 提示板
    this.add
      .image(1821 - window.offect.left, 467, "subject_1_level_cue_board_shadow")
      .setOrigin(0.5, 1);
    this.cueBoard = this.add
      .image(1821 - window.offect.left, 467, this.levelConfig.data.cueBoard)
      .setOrigin(0.5, 1);
    this.add
      .image(1841 - window.offect.left, 467, "subject_1_level_haystack")
      .setOrigin(0.5, 1);
  }
  /**
   * 设置block是否选中
   * @param container 存放block的容器对象
   * @param isSelect 是否要选中
   */
  setSelectBlock(container: Phaser.GameObjects.Container, isSelect) {
    if (!container) return;
    const blockImage = container.getAt(0) as Phaser.GameObjects.Image;
    if (isSelect) {
      if (blockImage && blockImage.texture.key.indexOf("_select") < 0) {
        blockImage.setTexture(blockImage.texture.key + "_select");
        blockImage.x -= 7;
        blockImage.y -= 7;
        blockImage.setDepth(9);
      }
    } else {
      if (blockImage && blockImage.texture.key.indexOf("_select") > -1) {
        blockImage.setTexture(blockImage.texture.key.replace("_select", ""));
        blockImage.x += 7;
        blockImage.y += 7;
        blockImage.setDepth(1);
      }
    }
  }
  /**
   * 创建方块放置的目的地
   */
  createBlockPlace() {
    this.blockBgList = new Array(3)
      .fill("subject_1_level_block_bg")
      .map((item, index) => {
        const blockBg = this.add.image(0, -CONVEX_HEIGHT, item).setOrigin(0, 0);
        const container = this.add
          .container(
            +this.game.config.width / 2 - blockBg.width / 2,
            242 + index * BLOCK_HEIGHT,
            blockBg
          )
          .setData("isFill", false)
          .setData("fillIndex", -1);
        container.width = blockBg.width;
        container.height = BLOCK_HEIGHT; //这里需要减去凸出来的高度
        // this.add
        //   .graphics()
        //   .fillStyle(0x000000, 0.5)
        //   .fillRect(
        //     container.x,
        //     container.y,
        //     container.width,
        //     container.height
        //   ); //debug
        return container;
      });
  }
  /**
   * 创建块的交互（拖拽，点击）
   */
  createBlockDrag() {
    let canTouchMove = false;
    let timeId;
    this.input.setDraggable(this.blockList, true);
    this.input.dragTimeThreshold = TOUCH_TIME; //似乎未生效
    this.input.on(
      "dragstart",
      (
        pointer: Phaser.Input.Pointer,
        gameObject: Phaser.GameObjects.Container
      ) => {
        console.log("dragstart");
        canTouchMove = true;
        gameObject.setData("isDraging", true);
        gameObject.setDepth(99);
        this.setSelectBlock(gameObject, true);
        /**
         * 放大为原来的尺寸并调整位置让其居中
         */
        const scale = 1;
        const x =
          gameObject.x - (gameObject.width * (scale - gameObject.scale)) / 2;
        const y =
          gameObject.y - (gameObject.height * (scale - gameObject.scale)) / 2;
        gameObject.setData(
          "posXOffect",
          (gameObject.width * (scale - gameObject.scale)) / 2
        );
        gameObject.setData(
          "posYOffect",
          (gameObject.height * (scale - gameObject.scale)) / 2
        );
        this.add.tween({
          targets: gameObject,
          x,
          y,
          scale,
          duration: 50,
        });
        // 移除block的填充状态,并设置gameObject的拖动来源
        const index = gameObject.getData("fillIndex");
        if (index > -1) {
          this.blockBgList[index].setData("isFill", false);
        }
        gameObject.setData("prevFillIndex", index);
        gameObject.setData("fillIndex", -1);
        this.layoutBlockContainerTimeId = window.setTimeout(() => {
          this.layoutBlockContainer();
        }, 100);
      },
      this
    );
    this.input.on(
      "drag",
      (pointer, gameObject: Phaser.GameObjects.Container, posX, posY) => {
        if (canTouchMove) {
          gameObject.x = posX - gameObject.getData("posXOffect");
          gameObject.y = posY - gameObject.getData("posYOffect");
        }
        const left = gameObject.x;
        const right = gameObject.x + gameObject.width;
        const top = gameObject.y;
        const bottom = gameObject.y + gameObject.height;
        /**
         * 长按时手指移动出了方块的范围，则取消拖动
         */
        if (posX < left || posX > right || posY < top || posY > bottom) {
          timeId && clearTimeout(timeId);
          timeId = null;
        }
      },
      this
    );
    this.input.on(
      "dragend",
      async (pointer, gameObject: Phaser.GameObjects.Container) => {
        console.log("dragend");
        timeId && clearTimeout(timeId);
        timeId = null;
        gameObject.setDepth(1);
        gameObject.setData("isDraging", false);
        const currentIndex = this.blockBgList.findIndex(
          (item: Phaser.GameObjects.Container, index: number, list) => {
            const width = item.width;
            const height = item.height;
            const x = gameObject.x;
            const y = gameObject.y;
            const left = item.x;
            const top = item.y;
            const right = item.x + width;
            const bottom = item.y + (height - 1); //注意这里，不能与上一个位置的方块重叠
            return (
              // 左上角
              (x >= left &&
                x <= right &&
                y >= top &&
                y <= bottom &&
                (bottom - y > height / 2 || index === list.length - 1)) || //左上角高于底部50%
              //右上角
              (x + width >= left &&
                x + width <= right &&
                y >= top &&
                y <= bottom &&
                (bottom - y > height / 2 || index === list.length - 1)) ||
              //左下角
              (x >= left &&
                x <= right &&
                y + height >= top &&
                y + height <= bottom) ||
              //右下角
              (x + width >= left &&
                x + width <= right &&
                y + height >= top &&
                y + height <= bottom)
            );
          }
        );
        if (currentIndex > -1) {
          this.musicManager.play("click_2");
          if (canTouchMove) {
            const beSwapBlock = this.blockList.find(
              (item: Phaser.GameObjects.Container) =>
                item.getData("fillIndex") === currentIndex
            ); //寻找原来位置上的方块
            if (beSwapBlock) {
              // 若存在，则交换位置
              const prevFillIndex = gameObject.getData("prevFillIndex");
              console.log("prevFillIndex:", prevFillIndex);
              if (prevFillIndex > -1) {
                // 与目标区域已有的方块交互（已有方块移动到拖动方块的原有位置上）
                beSwapBlock.setData("fillIndex", prevFillIndex);
                beSwapBlock.setData("fillTime", Date.now());
                this.blockBgList[prevFillIndex].setData("isFill", true);
                asyncTween(this, {
                  targets: beSwapBlock,
                  x: this.blockBgList[prevFillIndex].x,
                  y: this.blockBgList[prevFillIndex].y,
                  duration: 40,
                });
              } else {
                // 若原来在放区的位置则将被替换的方块，还原到存放区的位置
                asyncTween(this, {
                  targets: beSwapBlock,
                  scale: SCALE,
                  duration: TWEEN_DURATION,
                });
                beSwapBlock.setData("fillIndex", -1);
              }
            }
            this.blockBgList[currentIndex].setData("isFill", true);
            gameObject.setData("fillIndex", currentIndex);
            gameObject.setData("fillTime", Date.now());
            this.layoutBlockContainer();
            this.setSelectBlock(gameObject, false);
            asyncTween(this, {
              targets: gameObject,
              x: this.blockBgList[currentIndex].x,
              y: this.blockBgList[currentIndex].y,
              scale: 1,
              duration: 40,
            }).then(() => {
              this.checkAnswer();
            });
          }
          /**
           * 绑定点击后出现删除按钮
           */
          if (
            gameObject.x == this.blockBgList[currentIndex].x &&
            gameObject.y == this.blockBgList[currentIndex].y
          ) {
            this.bindBlockPointerdown(gameObject);
          }
        } else {
          this.setSelectBlock(gameObject, false);
          this.add.tween({
            targets: gameObject,
            scale: SCALE,
            duration: TWEEN_DURATION,
          });
          this.layoutBlockContainer();
        }
        canTouchMove = false;
      },
      this
    );
    // 点击其它地方，销毁block的删除按钮
    this.input.on("pointerdown", () => {
      if (this.deleteBtn) {
        const deleteTarget = this.deleteBtn.getData("deleteTarget");
        this.setSelectBlock(deleteTarget, false);
        this.deleteBtn.destroy();
      }
      this.deleteBtn = null;
    });
  }
  /**
   * 给方块绑定点击后的事件：显示删除按钮
   * 以及点击删除按钮的操作
   */
  bindBlockPointerdown(gameObject: Phaser.GameObjects.Container) {
    if (this.deleteBtn) return;
    this.deleteBtn = this.add
      .image(
        gameObject.x + gameObject.width + 27,
        gameObject.y + gameObject.height / 2,
        "subject_1_level_delete_btn"
      )
      .setOrigin(0, 0.5);
    this.setSelectBlock(gameObject, true);
    this.deleteBtn.setData("deleteTarget", gameObject);
    this.deleteBtn.setDepth(100).setInteractive();
    this.deleteBtn.once("pointerdown", () => {
      const fillIndex = gameObject.getData("fillIndex");
      this.blockBgList[fillIndex].setData("isFill", false);
      gameObject.setData("fillIndex", -1);
      this.layoutBlockContainer();
      this.setSelectBlock(gameObject, false);
      this.add.tween({
        targets: gameObject,
        // x: initPosition.x,
        // y: initPosition.y,
        scale: SCALE,
        duration: TWEEN_DURATION,
      });
      this.deleteBtn.destroy();
    });
    // bird.once('pointerup', () => {
    //   console.log('pointerup');

    // });
  }
  /**
   * 创建方块的池子和方块
   */
  createBlockSelectContainer() {
    const config = this.game.config;
    this.blockContainerImage = this.add
      .image(
        +config.width / 2,
        +config.height,
        "subject_1_level_block_container_bg"
      )
      .setOrigin(0.5, 1);

    /**
     * 创建方块
     */
    try {
      this.blockList = shuffle2Array(
        this.levelConfig.data.blocks.map((item, index) => {
          const block = this.add.image(0, -CONVEX_HEIGHT, item).setOrigin(0, 0);
          const container = this.add
            .container(
              this.blockContainerImage.x - block.width / 2,
              this.blockContainerImage.y,
              block
            )
            .setSize(block.width, BLOCK_HEIGHT)
            .setInteractive();
          container.input.hitArea.setPosition(
            container.width / 2,
            container.height / 2
          );
          container
            .setScale(SCALE)
            .setData("initPosition", { x: container.x, y: container.y })
            .setData("fillIndex", -1) //记录填充的位置在blockListbg的索引
            .setData("prevFillIndex", -1) //记录前一次填充的位置在blockListbg的索引
            .setData("answerIndex", index) //记录填充方块的索引，用于校验答案
            .setData("fillTime", Date.now()) //用于记录是否为最后拖拽的那一块
            .setData("isDraging", false);
          // this.add
          //   .graphics()
          //   .fillStyle(0x000000, 0.5)
          //   .fillRect(container.x, container.y, container.width, container.height); //debug
          return container;
        })
      );
    } catch (error) {
      console.error(error);
    }
  }
  /**
   * 计算并移动方块在容器中的位置（底部存放方块的地方）
   */
  layoutBlockContainer() {
    const filterBlockList = this.blockList.filter(
      (item) => item.getData("fillIndex") < 0
    );
    if (filterBlockList.length === 0) return;
    const paddingLeft =
      this.blockContainerImage.x -
      this.blockContainerImage.width / 2 +
      (this.blockContainerImage.width -
        filterBlockList.length * SCALE * BLOCK_WIDTH -
        (filterBlockList.length - 1) * MARGIN_LEFT) /
        2;
    const y =
      this.blockContainerImage.y -
      this.blockContainerImage.height +
      (this.blockContainerImage.height - SCALE * BLOCK_HEIGHT) / 2;
    filterBlockList.forEach(
      (item: Phaser.GameObjects.Container, index: number) => {
        const x =
          paddingLeft + index * SCALE * BLOCK_WIDTH + index * MARGIN_LEFT;
        item.setData("initPosition", { x, y }); // 设置来源位置（用于正在拖拽的方块）
        if (!item.getData("isDraging")) {
          // 排序移动
          // return new Promise((resolve) => {
          this.add.tween({
            targets: item,
            x,
            y,
            duration: TWEEN_DURATION,
            // onComplete: () => resolve(),
          });
          // });
        }
      }
    );
    // return Promise.resolve();
  }
  /**
   * 根据给定的数据，提前填充方块
   * 在this.levelConfig.data中
   * filled为配置中提前填充的block
   * answer为答案
   */
  presetFill(filled) {
    filled.forEach((item: number, index) => {
      if (item > -1) {
        const targetBlock = this.blockList.find(
          (block) => block.getData("answerIndex") === item
        );
        if (!targetBlock) return;
        const targetContainer = this.blockBgList[index];
        targetBlock.setData("fillIndex", index);
        targetContainer.setData("isFill", true);
        this.add.tween({
          targets: targetBlock,
          x: targetContainer.x,
          y: targetContainer.y,
          scale: 1,
          depth: 1,
          duration: TWEEN_DURATION,
        });
      }
    });
  }
  /**
   * 检查顺序是否正确
   */
  async checkAnswer() {
    const blockListFilter = this.blockList.filter(
      (item: Phaser.GameObjects.Container, index) =>
        item.getData("fillIndex") > -1
    );
    if (blockListFilter.length == 3) {
      const rightLength = blockListFilter
        .sort((a, b) =>
          a.getData("fillIndex") < b.getData("fillIndex") ? -1 : 1
        ) //根据fillIndex（即方块填充位置的顺序）排序，获得blockList从上到下的排列顺序
        .filter((item: Phaser.GameObjects.Container, index) => {
          //对比答案
          if (
            item.getData("answerIndex") != this.levelConfig.data.answer[index]
          ) {
            console.log("index:", index);
            console.log("这个方块是错误的顺序:", blockListFilter[index]);
            return false;
          }
          return true;
        }).length;
      if (rightLength == 3) {
        console.log("全部正确");
        this.input.setDraggable(this.blockList, false);
        await sleep(this, 500);
        this.scoreBoard.addScore(this.levelConfig.reward.total);
        new RewardDialog({
          scene: this,
          goldCount: this.levelConfig.reward.total,
          nextLevelConfig:
            this.game.registry.get("level_configs")[this.levelConfig.level],
        });
      } else {
        await this.shakeCueBoard();
        // 寻找最后拖拽的那一块，并还原到它的位置
        const blockListFilterSortByFillTime = blockListFilter.sort((a, b) =>
          a.getData("fillTime") < b.getData("fillTime") ? -1 : 1
        );
        const lastDragBlock =
          blockListFilterSortByFillTime[
            blockListFilterSortByFillTime.length - 1
          ];
        const fillIndex = lastDragBlock.getData("fillIndex");
        this.blockBgList[fillIndex].setData("isFill", false);
        lastDragBlock.setData("fillIndex", -1);
        this.add.tween({
          targets: lastDragBlock,
          scale: SCALE,
          duration: TWEEN_DURATION,
        });
        this.layoutBlockContainer();
      }
    }
  }
  /**
   * 摇晃提示板
   */
  async shakeCueBoard() {
    const duration = 50;
    const rotation = 1 / (Math.PI * 4);
    await asyncTween(this, {
      targets: this.cueBoard,
      rotation: -rotation,
      duration,
    });
    await asyncTween(this, {
      targets: this.cueBoard,
      rotation: rotation,
      duration: duration * 2,
    });
    await asyncTween(this, {
      targets: this.cueBoard,
      rotation: -rotation,
      duration: duration * 2,
    });
    await asyncTween(this, {
      targets: this.cueBoard,
      rotation: 0,
      duration,
    });
  }
}
