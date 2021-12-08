
declare namespace Tiles {
  interface BaseTilesStatic  extends Phaser.GameObjects.Container{
    new (param: ContainerParams): BaseTilesInstance;
    // 静态属性
    textureKeyPrefix: string;
    tileType: string;
  }
  interface BaseTilesInstance  extends Phaser.GameObjects.Container{
    // 实例属性
    id:string;
    colliderType: number;
    tileType: string;
    collect?: () => void;
    melt?: () => void;
  }
  interface BaseTiles extends BaseTilesStatic{}
}
