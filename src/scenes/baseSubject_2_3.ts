/**
 * @file 主题二、三的游戏场景父类
 * 游戏逻辑：
 * 1.根据游戏场景，用正确的顺序移动指令块到运行面板上，点击运行按钮，当角色获得所有四叶草/水滴等，游戏结束
 * 游戏细节
 * 碰撞到游戏场景的路径边缘后就执行下一个指令
 * 游戏结束条件：指令执行完毕
 * 游戏胜利条件：收集完所有四叶草物品，且指令执行完毕
 */
import ScoreBoard from "@/objects/scoreBoard";
import RewardDialog from "@/objects/rewardDialog";
import { sleep } from "@/utils";
import ClassBlockly from "@/objects/blockly/index";
import RoleMap from "@/objects/role";
import Clover from "@/objects/tiles/clover";
import Water from "@/objects/tiles/water";
import End from "@/objects/tiles/end";
import { colliderTypeEnum } from "@/enum";
import GameOverDialog from "@/objects/gameOverDialog";
export default abstract class BaseSubject_2_3 extends Phaser.Scene {
  private role: RoleTypes.Role;
  private blocklyRunIndex = 0;
  private blocklyRunList: Array<Blockly.RunItem> = [];
  private totalCurrency = 0;
  private collisionGroup: Phaser.GameObjects.Group;
  private overlapsGroup: Phaser.GameObjects.Group;
  private gridContainer: Phaser.GameObjects.Container;
  private currencyGroup: Phaser.GameObjects.Group;
  private collider: Phaser.Physics.Arcade.Collider;
  private overlap: Phaser.Physics.Arcade.Collider;
  private blockly: ClassBlockly;
  protected scoreBoard: ScoreBoard;
  protected levelConfig: Game.LevelConfigs;
  protected Tiles: {
    [key: string]: Tiles.BaseTiles;
  };
  constructor(config: string | Phaser.Types.Scenes.SettingsConfig) {
    super(config);
  }
  init({ levelConfig }) {
    // 获取关卡数据
    this.levelConfig = levelConfig;
  }
  create() {
    console.log(this.scene.key);
    if (!this.levelConfig) return console.error("level_config 数据有误");
    this.input.topOnly = true; //true为事件不击穿顶层纹理(点不到被覆盖的纹理)
    // this.input.setPollAlways();//将指针设置为始终轮询。
    this.events.on("shutdown", () => {
      // 关闭场景
      this.game.events.removeAllListeners(); //移出所有事件
    });
    this.initScene();
    this.initGrid();
    this.initRole();
    this.initBlockly();
    // this.test();
  }
  /**
   * 自动根据答案放置block
   */
  test() {
    const blockList = [...this.blockly.blockList];
    this.levelConfig.data.answer.forEach(
      (blockCnfig: { name; param; children }) => {
        const index = blockList.findIndex(
          (block: Blockly.BaseBlockInstance) => {
            return block.blockName === blockCnfig.name;
          }
        );
        if (~index) {
          const target = blockList.splice(index, 1)[0];
          target.setBlockScale(1, false, 0);
          target && this.blockly.runPanel.blockContainer.add(target);
        }
      }
    );
    setTimeout(() => {
      this.blockly.runPanel.blockContainer.layoutDropRect();
      setTimeout(() => {
        this.blockly.runPanel.run();
      }, 500);
    }, 10);
  }
  /**
   * 初始化场景
   */
  protected abstract initScene(); //因为Scene是先实例化，再调用create-->initScene
  /**
   * 切换下一个block
   */
  private switchNextBlock() {
    const prevCodeItem = this.blocklyRunList[this.blocklyRunIndex];
    if (prevCodeItem) {
      this.blockly.unSelectBlock(prevCodeItem.blockId);
      prevCodeItem.parentIds.forEach((item) =>
        this.blockly.unSelectBlock(item)
      );
    }
    if (this.blocklyRunIndex < this.blocklyRunList.length - 1) {
      this.blocklyRunIndex++;
      const current = this.blocklyRunList[this.blocklyRunIndex];
      this.blockly.selectBlock(current.blockId);
      current.parentIds.forEach((item) => this.blockly.selectBlock(item));
      current.func();
    } else {
      this.gameEnd(this.totalCurrency != 0);
    }
  }
  /**
   * 初始化角色
   */
  private initRole() {
    // 角色
    const roleParam: RoleTypes.RoleParams = {
      scene: this,
      x: this.levelConfig.data.role.x,
      y: this.levelConfig.data.role.y,
      onNext: () => {
        this.switchNextBlock();
      },
      onRunError: () => {
        // 游戏结束
      },
    };
    this.role = new RoleMap[this.levelConfig.data.role.roleType](roleParam);
    /**
     * 设置角色的边界(只可以在网格内移动)
     */
    const { x, y, width, height } = this.gridContainer;
    const roleRect = new Phaser.Geom.Rectangle(x, y, width, height);
    this.role.thatBody.setBoundsRectangle(roleRect);
    this.role.thatBody.setCollideWorldBounds(true);
    this.role.thatBody.onWorldBounds = true;
    this.gridContainer.add(this.role);
  }
  /**
   * 初始化智指令块
   */
  private initBlockly() {
    // 生成blockly
    const { blocks, blocklyTheme, infiniteBlock } = this.levelConfig.data;
    this.blockly = new ClassBlockly({
      scene: this,
      blocks,
      theme: blocklyTheme,
      infiniteBlock,
      runPanel: {
        cb: {
          onRun: (list: Blockly.CodeItem[]) => {
            this.blocklyRunList = ClassBlockly.parseBlockList.bind(this)(list);
            this.blocklyRunIndex = 0;
            if (list.length > 0) {
              const current = this.blocklyRunList[this.blocklyRunIndex];
              this.blockly.selectBlock(current.blockId);
              current.parentIds.forEach((item) =>
                this.blockly.selectBlock(item)
              );
              current.func();
              this.physicsEventBind();
            } else {
              this.blockly.runPanel.runEnd();
            }
          },
        },
      },
    });
  }
  /**
   * 初始化网格及其元素
   */
  private initGrid() {
    const grid = this.add
      .image(0, 0, this.levelConfig.gridBg || "subject_2_level_theme_1_grid")
      .setOrigin(0, 0);
    const currencyGroup = (this.currencyGroup = this.add.group()); //金币组
    this.collisionGroup = this.add.group(); //碰撞组
    const overlapsGroup = (this.overlapsGroup = this.add.group()); //碰撞后可重叠组
    // 所有瓦片素材
    const tilesList = [];
    this.levelConfig.data.tiles.forEach((item) => {
      const Tile = this.Tiles[item.tileType];
      if (!Tile) return console.warn("未找到" + item.tileType + "类型的瓦片");
      const tile = new Tile({
        scene: this,
        x: item.x,
        y: item.y,
      });
      // 货币(可被收集)
      (tile.tileType === Clover.tileType || tile.tileType === Water.tileType) &&
        currencyGroup.add(tile);
      // 碰撞
      tile.colliderType === colliderTypeEnum.collision &&
        this.collisionGroup.add(tile);
      // 重叠
      tile.colliderType === colliderTypeEnum.overlaps &&
        overlapsGroup.add(tile);
      tilesList.push(tile);
    });
    this.totalCurrency = currencyGroup.getLength();
    /**
     * 网格容器
     */
    const gridContainer = (this.gridContainer = this.add.container(
      (+this.game.config.width - grid.width) / 2,
      163,
      [grid, ...tilesList]
    ));
    gridContainer.width = grid.width;
    gridContainer.height = grid.height;
  }

  /**
   * 移除物理事件
   */
  private removePhysicsEvent() {
    this.physics.world.off("worldbounds");
    this.collider && this.collider.destroy();
    this.collider = null;
    this.overlap && this.overlap.destroy();
    this.overlap = null;
  }
  /**
   * 绑定物理事件
   */
  private physicsEventBind() {
    /**
     * 边界碰撞检测
     */
    this.physics.world.on(
      "worldbounds",
      (
        body: Phaser.Physics.Arcade.Body,
        up: boolean,
        down: boolean,
        left: boolean,
        right: boolean
      ) => {
        // this.handleCollider(this.role);
        // 跳出边界
        let x = this.role.x;
        let y = this.role.y;
        if (up) y -= 102;
        if (down) y += 102;
        if (left) x -= 102;
        if (right) x += 102;
        this.role.thatBody.setCollideWorldBounds(false);
        this.role.stopMove();
        this.role.moveToObject({
          x,
          y,
        });
        this.gameEnd(true);
      }
    );
    // 碰撞检测
    this.collider = this.physics.add.collider(
      this.collisionGroup,
      this.role,
      (tile: Game.BaseTilesType, role: Game.BaseRoleType) => {
        this.handleCollider(role, tile);
      }
    );
    // 重叠检测
    this.overlap = this.physics.add.overlap(
      this.overlapsGroup,
      this.role,
      (tile: Game.BaseTilesType, role: Game.BaseRoleType) => {
        switch (tile.tileType) {
          // 收集事四叶草
          case Clover.tileType:
          case Water.tileType:
            this.currencyGroup.remove(tile, false, false);
            if (this.currencyGroup.getChildren().length === 0) {
              // 金币收集完毕,游戏结束
              role.stopMove();
              role.moveToObject(tile);
              this.gameEnd();
            }
            this.gridContainer.bringToTop(tile);
            this.overlapsGroup.remove(tile, false, false); // 移出物理世界
            tile.collect && tile.collect();
            break;
          case End.tileType:
            // 去到了不该去的地方,游戏结束
            this.overlapsGroup.remove(tile, false, false); // 移出物理世界
            role.stopMove();
            role.moveToObject(tile);
            this.gameEnd(true);
            break;
          default:
        }
      }
    );
  }
  /**
   * 处理角色与可碰撞元素及世界边界碰撞的逻辑
   * @param role 角色
   * @param tile 碰撞到的物体,若为undefined,则为碰撞到世界边缘
   */
  private handleCollider(role: RoleTypes.Role, tile?: any) {
    console.log("handleCollider:", tile && tile.id);
    if (!role.isStopMove) {
      //避免由于延时导致重复碰撞（暂时未了解清楚tween的原理）
      role.stopMove();
      console.log("next");
      this.switchNextBlock();
    }
  }
  /**
   * 游戏结束
   * @param isFail boolean 是否游戏失败
   */
  private async gameEnd(isFail = false) {
    this.blockly.runPanel.runEnd();
    this.removePhysicsEvent();
    // this.game.events.emit("run_block_end");//useless
    if (isFail) {
      // TODO
      await sleep(this, 1500);
      console.log("isFail");
      new GameOverDialog({
        scene: this,
      });
      return;
    }
    await sleep(this, 2000);
    this.scoreBoard.addScore(this.levelConfig.reward.total);
    const nextLevelConfig =
      this.game.registry.get("level_configs")[this.levelConfig.level];
    // if (nextLevelConfig) {
    //   this.router.redirect(nextLevelConfig.sceneKey, {
    //     levelConfig: nextLevelConfig,
    //   });
    //   return;
    // }
    new RewardDialog({
      scene: this,
      goldCount: this.levelConfig.reward.total,
      nextLevelConfig: nextLevelConfig,
    });
  }
}
