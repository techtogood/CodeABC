/**
 * 游戏角色(已弃用，跳跃改完雪碧图动画)
 */
// import { colliderTypeEnum } from "@/enum";
const Distance = 20; //缩小role的body，避免与地图瓦片发生1px擦身碰撞（解决角色边缘与瓦片碰撞后重叠阿问题）
const HalfDistance = Distance / 2;
export default class BaseRole extends Phaser.GameObjects.Container {
  static SPEED = 102; //移动速度
  static roleType = "";
  width = 102;
  height = 102;
  public thatBody: Phaser.Physics.Arcade.Body;
  protected roleTexture: Phaser.GameObjects.Image;
  protected roleShadow: Phaser.GameObjects.Image;
  protected moveTween: Phaser.Tweens.Tween;
  protected isStopMove = true; //用于带参数的block，记录是否因为调用了stop，然后block的次数未执行完，则表示运行错误
  protected jumpTweenRoleTween: Phaser.Tweens.Tween;
  protected jumpTweenRoleShadowTween: Phaser.Tweens.Tween;
  protected param: RoleTypes.BaseRoleParams;
  protected isAutoSwitchNext = false; //用于区分stopMove后是否自动切换到下一个block,用于left/right/top/bottom的碰撞后切换blcok的逻辑
  protected disabledSwitchNext = false; //用于暂停当前只执行块
  public isWaiting = false; //用于外部判断role是否在等待状态
  moveTag = "";
  constructor(param: RoleTypes.BaseRoleParams) {
    super(param.scene, param.x, param.y);
    this.param = param;
    this.roleTexture = param.scene.add
      .image(45, 63, `${param.roleTexture}`)
      .setOrigin(0.5, 1);
    this.roleShadow = param.scene.add
      .image(51, 62, `${param.roleTexture}_shadow`)
      .setOrigin(0.5, 0.5);
    this.add([this.roleShadow, this.roleTexture]);
    this.addToPhysics();
    this.jump();
  }
  private addToPhysics() {
    this.scene.physics.add.existing(this);
    this.thatBody = <Phaser.Physics.Arcade.Body>this.body;
    this.thatBody.offset.x = 102 / 2 + HalfDistance;
    this.thatBody.offset.y = 102 / 2 + HalfDistance;
    this.thatBody.setSize(102 - Distance, 102 - Distance);
    this.thatBody.setBounce(0, 0);
    this.thatBody.setImmovable(false); //禁止被碰撞后移动
  }

  reset() {
    this.alpha = 1;
  }
  public jump() {
    this.jumpTweenRoleTween = this.scene.add.tween({
      targets: this.roleTexture,
      y: 43,
      duration: 500,
      ease: "Cubic.easeOut",
      repeat: -1,
      yoyo: true,
    });
    this.jumpTweenRoleShadowTween = this.scene.add.tween({
      targets: this.roleShadow,
      scale: 0,
      duration: 500,
      ease: "Cubic.easeOut",
      repeat: -1,
      yoyo: true,
    });
  }
  /**
   * 向指定目标移动,用于游戏结束时,位置的校准
   */
  moveToObject(
    object: Phaser.GameObjects.Container | { x: number; y: number }
  ) {
    const x = object.x;
    const y = object.y;
    const distance = Math.max(Math.abs(this.x - x), Math.abs(this.y - y));
    const duration = distance / BaseRole.SPEED;
    return new Promise((rsolve) => {
      this.moveTween = this.scene.add.tween({
        targets: this,
        x,
        y,
        duration: duration * 1000,
        onComplete: () => {
          this.thatBody.stop();//在iPhone12发现会继续有速度，bug
          this.moveTween = null;
          rsolve(undefined);
        },
      });
    });
  }
  /**
   *  停止移动
   * @returns boolean 是否自动切换到下一个block
   */
  stopMove(): boolean {
    switch (this.moveTag) {
      case "left":
        this.thatBody.offset.x += HalfDistance;
        break;
      case "right":
        this.thatBody.offset.x -= HalfDistance;
        break;
      case "top":
        this.thatBody.offset.y += HalfDistance;
        break;
      case "bottom":
        this.thatBody.offset.y -= HalfDistance;
        break;
    }
    this.moveTag = "";
    this.thatBody.stop();
    this.moveTween && this.moveTween.isPlaying() && this.moveTween.stop();
    this.isStopMove = true;
    return this.isAutoSwitchNext;
  }
  trunLeft() {
    this.roleTexture.flipX = true;
    this.roleTexture.x = 57;
    return this;
  }
  trunRight() {
    this.roleTexture.flipX = false;
    this.roleTexture.x = 45;
    return this;
  }
  left() {
    return () => {
      this.moveTag = "left";
      this.thatBody.offset.x -= HalfDistance;
      this.isAutoSwitchNext = true;
      this.trunLeft()
      this.jumpTweenRoleTween
        ? this.jumpTweenRoleTween.once("repeat", () =>
           this.thatBody.setVelocityX(-BaseRole.SPEED)
          )
        : this.thatBody.setVelocityX(-BaseRole.SPEED);
    };
  }
  right() {
    return () => {
      this.moveTag = "right";
      this.thatBody.offset.x += HalfDistance;
      this.isAutoSwitchNext = true;
      this.trunRight();
      this.jumpTweenRoleTween
        ? this.jumpTweenRoleTween.once("repeat", () =>
            this.thatBody.setVelocityX(BaseRole.SPEED)
          )
        : this.thatBody.setVelocityX(BaseRole.SPEED);
    };
  }
  top() {
    return () => {
      this.moveTag = "top";
      this.thatBody.offset.y -= HalfDistance;
      this.isAutoSwitchNext = true;
      this.jumpTweenRoleTween
        ? this.jumpTweenRoleTween.once("repeat", () =>
            this.thatBody.setVelocityY(-BaseRole.SPEED)
          )
        : this.thatBody.setVelocityY(-BaseRole.SPEED);
    };
  }
  bottom() {
    return () => {
      this.moveTag = "bottom";
      this.thatBody.offset.y += HalfDistance;
      this.isAutoSwitchNext = true;
      this.jumpTweenRoleTween
        ? this.jumpTweenRoleTween.once("repeat", () =>
            this.thatBody.setVelocityY(BaseRole.SPEED)
          )
        : this.thatBody.setVelocityY(BaseRole.SPEED);
    };
  }
}
