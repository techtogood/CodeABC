/**
 * 角色3
 */
import { asyncTween, sleep } from "@/utils/index";
import BaseRole from "@/objects/role/baseRole_v3";
export default class Role extends BaseRole {
  static roleType = "role_3";
  constructor(param: ContainerParams) {
    super({ ...param, roleTexture: Role.roleType });
  }
  /**
   * 融化冰冻的企鹅
   * @param object
   * @returns
   */
  todo() {}
  /**
   * 跳进传送门
   * @param object
   * @returns
   */
  async transfer(
    object: Phaser.GameObjects.Container | { x: number; y: number }
  ) {
    await asyncTween(this.scene, {
      targets: this.roleTexture,
      scale: 0,
      alpha: 0,
      duration: 1000,
      yoyo: true,
      onYoyo: () => {
        this.setPosition(object.x, object.y);
      },
    });
  }
  alphaTween(a = 1) {
    asyncTween(this.scene, {
      targets: this,
      alpha: a,
      duration: 250,
    });
  }
  resumeJump() {
    // this.jumpTweenRoleTween &&
    //   this.jumpTweenRoleTween.isPaused &&
    //   this.jumpTweenRoleTween.resume();
    // this.jumpTweenRoleShadowTween &&
    //   this.jumpTweenRoleShadowTween.isPaused &&
    //   this.jumpTweenRoleShadowTween.resume();
  }
  public pauseJump() {
    // this.jumpTweenRoleTween &&
    //   this.jumpTweenRoleTween.isPlaying() &&
    //   this.jumpTweenRoleTween.pause();
    // this.jumpTweenRoleShadowTween &&
    //   this.jumpTweenRoleShadowTween.isPlaying() &&
    //   this.jumpTweenRoleShadowTween.pause();
  }
  /**
   * 暂停当前的移动任务
   */
  pauseCurrentMove() {
    this.checkPosition();
    this.roleTexture.stop();
    this.moveTween && this.moveTween.isPlaying() && this.moveTween.pause();
    this.isStopMove = true;
    this.jump("waitJump");
  }
  /**
   * 恢复当前的移动任务
   */
  async resumeCurrentMove() {
    const func = () => {
      this.isStopMove = false;
      this.moveTween && this.moveTween.isPaused && this.moveTween.resume();
      this.playJump();
    };
    this.isJumping
      ? this.roleTexture.once("animationstart", func, this)
      : func();
  }
  setDisabledSwitchNext(bool: boolean) {
    this.disabledSwitchNext = bool;
    return this;
  }
  setShadowVisible(bool: boolean) {
    this.roleShadow.setVisible(bool);
    return this;
  }
  rightParam(count: number) {
    return () => {
      this.trunRight();
      const func = () =>
        setTimeout(async () => {
          this.isStopMove = this.isAutoSwitchNext = false;
          let i = 0;
          while (i < count) {
            i++;
            await Promise.all([
              this.moveToObject({
                x: this.x + BaseRole.SPEED,
                y: this.y,
              }),
              this.playJump(),
            ]);
            if (this.isStopMove) break;
          }
          !this.disabledSwitchNext &&
            i === count &&
            this.param.onNext &&
            this.param.onNext();
        });
      this.isJumping
        ? this.roleTexture.once("animationcomplete", func, this)
        : func();
    };
  }
  leftParam(count: number) {
    return () => {
      this.trunLeft();
      const func = () =>
        setTimeout(async () => {
          this.isStopMove = this.isAutoSwitchNext = false;
          let i = 0;
          while (i < count) {
            i++;
            await Promise.all([
              this.moveToObject({
                x: this.x - BaseRole.SPEED,
                y: this.y,
              }),
              this.playJump(),
            ]);
            if (this.isStopMove) break;
          }
          !this.disabledSwitchNext &&
            i === count &&
            this.param.onNext &&
            this.param.onNext();
        });
      this.isJumping
        ? this.roleTexture.once("animationcomplete", func, this)
        : func();
    };
  }
  topParam(count: number) {
    return () => {
      const func = () =>
        setTimeout(async () => {
          this.isStopMove = this.isAutoSwitchNext = false;
          let i = 0;
          while (i < count) {
            i++;
            await Promise.all([
              this.moveToObject({
                x: this.x,
                y: this.y - BaseRole.SPEED,
              }),
              this.playJump(),
            ]);
            if (this.isStopMove) break;
          }
          !this.disabledSwitchNext &&
            i === count &&
            this.param.onNext &&
            this.param.onNext();
        });
      this.isJumping
        ? this.roleTexture.once("animationcomplete", func, this)
        : func();
    };
  }
  bottomParam(count: number) {
    return () => {
      const func = () =>
        setTimeout(async () => {
          this.isStopMove = this.isAutoSwitchNext = false;
          let i = 0;
          while (i < count) {
            i++;
            await Promise.all([
              this.moveToObject({
                x: this.x,
                y: this.y + BaseRole.SPEED,
              }),
              this.playJump(),
            ]);
            if (this.isStopMove) break;
          }
          !this.disabledSwitchNext &&
            i === count &&
            this.param.onNext &&
            this.param.onNext();
        });
      this.isJumping
        ? this.roleTexture.once("animationcomplete", func, this)
        : func();
    };
  }
  get role() {
    return this;
  }
  whileParam(count: number, children: { blockId: string; codeStr: string }[]) {
    const list = new Array();
    for (let i = 0; i < count; i++) {
      list.push.apply(list, children);
    }
    return list;
  }
  /**
   * 应用于执行Wait_Block（用于等待动物移动)
   * @returns
   */
  wait() {
    return async () => {
      this.isWaiting = true;
      this.isAutoSwitchNext = false;
      this.isStopMove = true;
      this.jump("waitJump");
      await sleep(this.scene, 3000);
      this.roleTexture.once("animationcomplete", () => {
        !this.disabledSwitchNext && this.param.onNext && this.param.onNext();
        this.isWaiting = false;
      });
    };
  }
}
