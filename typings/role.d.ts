declare namespace RoleTypes {
  type RoleParams = {
    scene: Phaser.Scene;
    x: number;
    y: number;
    onNext?: () => void;
    onRunError?: () => void;
  };
  type BaseRoleParams = {
    roleTexture: string;
  } & RoleParams;

  class Role extends Phaser.GameObjects.Container {
    thatBody: Phaser.Physics.Arcade.Body;
    constructor(param: RoleParams);
    static roleType: string;
    roleType: string;
    stopMove: () => boolean;
    isWaiting: boolean;
    isStopMove: boolean;
    reset(): void;
    moveToObject(
      object: Phaser.GameObjects.Container | { x: number; y: number }
    ): Promise<any>;
    transfer(
      object: Phaser.GameObjects.Container | { x: number; y: number }
    ): Promise<any>;
    pauseCurrentMove(): void;
    resumeCurrentMove(): void;
    setDisabledSwitchNext(bool: boolean): this;
    setShadowVisible(bool: boolean): this;
    pauseJump(): void;
    resumeJump(): void;
    alphaTween(a?: number): void;
  }
}
