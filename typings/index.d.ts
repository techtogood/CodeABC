interface Window {
  offect: any;
  WebFont: any;
  process:any;
}

declare type ContainerParams = {
  scene: Phaser.Scene;
  x: number;
  y: number;
};

// declare namespace subject_1{
//    class Tile extends BaseContainer {
//     static type:string;
//   }

// }
declare module "*.ttf" {
  const content: any;
}
declare module "*.csv" {
  const content: any;
  export = content;
}
declare namespace Game {
  //该游戏主题需要的资源
  type PackJson = {
    preload: {
      files: {
        type: string;
        key: string;
        url: string;
      }[];
    };
  };
  type MapTiles = {
    // 场景入口的背景配置
    key: string; //背景纹理的key
    decoration: Array<{
      // 装饰物
      x: number;
      y: number;
      key: string;
      depth: number; //层级
    }>;
  };
  // 游戏配置
  type LevelConfigs = {
    //关卡信息
    bg: string;
    level: number; //关卡的编号
    sceneKey: string; //该关卡的场景key
    gridBg?: string;
    reward?: {
      total: number;
    };
    data: {
      [key: string]: any;
    };
  };
  type SubjectConfig = {
    subject: number;
    sceneKey: string; //游戏场景，与场景的key对应
    packJson: PackJson;
    mapTiles: Array<MapTiles>;
    levelEntryConfigs: Array<{
      // 关卡入口的纹理及其配置
      level: number;
      x: number;
      y: number;
      open: boolean; // 是否开放
      key: string; //纹理的key
    }>;
    levelConfigs: Array<LevelConfigs>;
  };

  type BaseTilesType = Tiles.BaseTilesInstance &
    Phaser.Types.Physics.Arcade.GameObjectWithBody;
  type BaseRoleType = RoleTypes.Role &
    Phaser.Types.Physics.Arcade.GameObjectWithBody;

  // 主题五
  interface GoodsType extends Phaser.GameObjects.Container {
    goodsType: string;
    matchRobotArm: string;
    physicsWidth: number;
    physicsClipOffectY: number;
    physicsOffectY: number;
    goodsImage: Phaser.GameObjects.Image;
    hideShadow(): (progress: number) => void;
    showShadow(x: number, y: number): (progress: number) => void;
  }
  interface DrinkType extends Phaser.GameObjects.Container {
    drinkType: string;
    matchRobotArm: string;
    physicsWidth: number;
    physicsClipOffectY: number;
    goodsImage: Phaser.GameObjects.Image;
    hideShadow(): (progress: number) => void;
    showShadow(x: number, y: number): (progress: number) => void;
  }
  // 积木砖块
  interface BrickType extends Phaser.GameObjects.Container {
    brickType: string;
    physicsClipOffectY: number;
    initPositionOffectY: number;
    brickImage: Phaser.GameObjects.Image;
  }
  // 字母砖块
  interface LetterType extends Phaser.GameObjects.Container {
    letterType: string;
    physicsClipOffectY: number;
    initPositionOffectY: number;
    letterImage: Phaser.GameObjects.Image;
    offsetX: number;
  }
  // 主题五的车
  class Car extends Phaser.GameObjects.Container {
    static carName: string;
    constructor(param: { next(): void } & ContainerParams);
    public goodsList: Game.GoodsType[];
    public isPark: boolean;
    positionList: Array<Array<number>>;
    public platformFloor: Phaser.GameObjects.Container;
    getTargetPosition(
      goods: Game.GoodsType,
      canMove: boolean
    ): {
      x: number;
      y: number;
      depth: number;
    };
    moveOut(): Promise<undefined>;
    moveIn(): Promise<undefined>;
    private loading(): void;
  }
  // 主题5，机械臂
  interface RobotArmInterface {
    updateFingerMidPositionByJoint?: () => void;
    moveToGoodsTopPosition(
      x: number,
      y: number,
      palmOffectY: number
    ): Promise<undefined>;
    takeAGoods(
      goods: GoodsType | BrickType | LetterType | DrinkType,
      clipWidth: number,
      palmOffectY: number,
      canMove: boolean
    ): void;
    putUp(
      controlHideGoodsShadowCb: (progress: number) => void
    ): Promise<undefined>;
    moveAGoods(
      x: number,
      y: number,
      palmOffectY: number,
      controlShowGoodsShadowCb?: (progress: number) => void
    ): Promise<undefined>;
    putAGoods(
      goods: GoodsType | BrickType | LetterType | DrinkType,
      x: number,
      y: number,
      index: number
    ): void;
    packUp(): Promise<undefined>;
    openRedLamp(): void;
    openGreenLamp(): void;
  }
  class RobotArm
    extends Phaser.GameObjects.Container
    implements RobotArmInterface
  {
    constructor(param: { scene: Phaser.Scene });
    updateFingerMidPositionByJoint?: () => void;
    moveToGoodsTopPosition(
      x: number,
      y: number,
      palmOffectY: number
    ): Promise<undefined>;
    takeAGoods(
      goods: GoodsType | BrickType | LetterType | DrinkType,
      clipWidth: number,
      palmOffectY: number,
      canMove: boolean
    ): void;
    putUp(
      controlHideGoodsShadowCb?: (progress: number) => void
    ): Promise<undefined>;
    moveAGoods(
      x: number,
      y: number,
      palmOffectY: number,
      controlShowGoodsShadowCb?: (progress: number) => void
    ): Promise<undefined>;
    putAGoods(
      goods: GoodsType | BrickType | LetterType | DrinkType,
      x: number,
      y: number,
      index: number
    ): void;
    packUp(): Promise<undefined>;
    openRedLamp(): void;
    openGreenLamp(): void;
  }
}
