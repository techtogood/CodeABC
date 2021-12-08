
type Param = {
  initScale: number;
  subject: number;
  isLock: boolean;
  isAfterLock: boolean;
  star: number;
  text: {
    title: string;
    subTitle: string;
  };
  onBtnClick?: () => void;
} & ContainerParams
export default class SubjectEntryItem extends Phaser.GameObjects.Container {
  private bg: Phaser.GameObjects.Image;
  private subject_1: Phaser.GameObjects.Image;
  private subject_1_2: Phaser.GameObjects.Image;
  private subject_1_3: Phaser.GameObjects.Image;
  private subject_1_container: Phaser.GameObjects.Container;
  param: Param;
  constructor(param: Param) {
    super(param.scene, param.x, param.y)
    this.param = param;
    this.init();
    param.scene.add.existing(this)
  }
  init() {
    this.bg = this.scene.add.image(0, 0, "main_subject_entry_bg");
    this.width = this.bg.width;
    this.height = this.bg.height;
    // 方块、方块侧面、投影
    this.subject_1_3 = this.scene.add.image(0, 112, "main_subject_entry_shadow").setOrigin(1).setScale(0.98);
    this.subject_1_2 = this.scene.add.image(this.subject_1_3.x - 5, this.subject_1_3.y - 8, "main_subject_entry_side").setOrigin(1).setScale(0.98);
    this.subject_1 = this.scene.add.image(this.subject_1_2.x - 12, this.subject_1_2.y - 4, `main_subject_entry_${this.param.subject}`).setOrigin(1);
    this.subject_1_container = this.scene.add.container(0, 0, [this.subject_1_3, this.subject_1_2, this.subject_1])
    //按钮
    const btn = this.scene.add.image(0, this.height / 2, this.param.isLock ? "main_btn_lock" : "main_btn_start");
    btn.setInteractive()
      .on("pointerup", pointer => {
        pointer.getDistanceY() < 1 && this.param.onBtnClick && this.param.onBtnClick()
      });
    // 星星
    const starContainer = this.scene.add.container();
    for (let i = 1; i <= 3; i++) {
      starContainer.add(this.scene.add.image(20 + (i - 1) * 75, 30, this.param.star >= i ? "main_star_fill" : "main_star").setOrigin(0))
    }
    // 文字
    const title = this.scene.add
      .text(20, -150,
        this.param.text.title,
        {
          fontFamily: "PuHuiTi",
          fontSize: "44px",
          color: "#fff",
          fontStyle: "bold",
          // fixedWidth: 183,
          // fixedHeight: 62,
          // backgroundColor: "rgba(0,0,0,0.3)",
        }
      )
    const subTitle = this.scene.add
      .text(20, -70,
        this.param.text.subTitle,
        {
          fontFamily: "PuHuiTi",
          fontSize: "32px",
          color: "rgba(255,255,255,.9)",
          wordWrap: { width: 300, useAdvancedWrap: true },
          // fixedWidth: 183,
          // fixedHeight: 62,
          // backgroundColor: "rgba(0,0,0,0.3)",
        }
      )
    if (this.param.isAfterLock) {
      this.subject_1_container.setAlpha(.5)
    }
    this.setEntryScale(this.param.initScale)
    this.add([this.bg, this.subject_1_container, btn, starContainer, title, subTitle])
  }
  setEntryScale(scale) {
    this.scale = scale
    const ratio = 1 - (1 - scale) / (1 - this.param.initScale)
    this.subject_1_3.setScale(0.98 + 0.02 * ratio);
    this.subject_1_2.setPosition(this.subject_1_3.x - 5 - 7 * ratio, this.subject_1_3.y - 8 - 7 * ratio).setScale(0.98 + 0.02 * ratio);
    this.subject_1.setPosition(this.subject_1_2.x - 12 - 12 * ratio, this.subject_1_2.y - 4 - 12 * ratio);
    return this
  }
}