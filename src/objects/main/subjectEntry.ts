import MainConfig from "@/config/main";
import SubjectEntryItem from './subjectEntryItem';
const StorageKey = "main_entry_active_index";
const EntryConfig = [
  { title: "草原主题", subTitle: "快来看看吧，草原又来一群新伙伴哦..." },
]
const InitScale = 0.85;//非选中状态的方块大小
export default class subjectEntry extends Phaser.GameObjects.Container {
  private totalWidth: number;
  activeIndex = +(window.localStorage.getItem(StorageKey) || 0);
  entryList: SubjectEntryItem[] = [];
  scrollIndexList = [];
  constructor(param: ContainerParams) {
    super(param.scene);
    const width = +param.scene.game.config.width;
    const height = +param.scene.game.config.height;
    let totalWidth = width / 2; //记录岛屿的总长度（config.width+岛屿之间的距离）
    let isClick = false; //只允许点击一个岛屿
    for (let i = 0; i < MainConfig.subjects.length; i++) {
      this.entryList.push(
        new SubjectEntryItem({
          scene: this.scene,
          x: totalWidth,
          y: height / 2 + 130,
          initScale: InitScale,
          star: (5 - i) % 3,
          subject: i + 1,
          onBtnClick: () => {
            if (!isClick) {
              this.scene.musicManager.play("click");
              isClick = true;
              window.localStorage.setItem(StorageKey, i.toString());
              if (this.activeIndex != i) {
                this.activeIndex = i;
                // await this.moveToIndex(i, 500);
              }
              this.scene.router.push(MainConfig.subjects[i].sceneKey, {
                packJson: MainConfig.subjects[i].packJson,
              });
            }
          },
          text: EntryConfig[i],
          isLock: i > 1,
          isAfterLock: i > 2
        })
      );
      totalWidth += 850;
    }
    totalWidth = totalWidth + width / 2 - 850;
    this.totalWidth = totalWidth;
    this.setSize(this.totalWidth, height);
    param.scene.add.existing(this);
    this.createMapScroll();
    this.moveToIndex(this.activeIndex, 0);
  }
  /**
   * 移动到某一个岛屿
   * @param index
   * @param duration
   * @returns
   */
  moveToIndex(index, duration = 1000) {
    const width = +this.scene.game.config.width;
    return new Promise((resolve) => {
      const targetX = { x: this.scene.cameras.main.scrollX };
      this.scene.add.tween({
        targets: targetX,
        x: (width / 3) * index,
        ease: "Quart.easeOut",
        duration,
        onUpdate: () => {
          this.scene.cameras.main.scrollX = targetX.x;
          this.scaleEntry();
        },
        onComplete: resolve,
      });
    });
  }
  scaleEntry() {
    // 缩放岛屿
    const width = +this.scene.game.config.width;
    const currentX = this.scene.cameras.main.scrollX + width / 2;
    for (let i = 0; i < this.entryList.length; i++) {
      const x = this.entryList[i].x;
      if (Math.abs(currentX - x) < width / 3) {
        this.entryList[i].setEntryScale(
          Math.min(1, 1 - ((1 - InitScale) * Math.abs(currentX - x)) / (width / 3))
        );
      }
    }
  }
  /**
   * 滚动cameras，并模拟惯性滚动
   */
  createMapScroll() {
    let pointerdownX = 0; //前一个滑动的点
    let moveLength = 0; //滑动的距离
    let isDown = false;
    let isPointermove = false;
    this.scene.input.on(
      "pointerdown",
      (pointer, currentlyOver) => {
        // console.log("pointerdown");
        pointerdownX = pointer.x;
        scrollTween && scrollTween.pause();
        isDown = true;
      },
      this
    );
    this.scene.input.on(
      "pointermove",
      (pointer, currentlyOver) => {
        // console.log("pointermove");
        if (isDown) {
          isPointermove = true;
          let scrollX = this.scene.cameras.main.scrollX;
          scrollX -= (pointer.position.x - pointer.prevPosition.x) * 2;
          scrollX = Math.max(scrollX, 0);
          scrollX = Math.min(
            scrollX,
            this.totalWidth - +this.scene.game.config.width
          );
          this.scene.cameras.main.scrollX = scrollX;
          this.scaleEntry();
        }
      },
      this
    );
    let scrollTween: Phaser.Tweens.Tween;
    this.scene.input.on(
      "pointerup",
      (pointer: Phaser.Input.Pointer, currentlyOver) => {
        // console.log("pointerup");
        if (!isDown) return;
        isDown = false;
        if (!isPointermove) return
        isPointermove = false;
        moveLength = (pointer.x - pointerdownX) * 2;
        const width = +this.scene.game.config.width;
        let currentIndex = 0;
        const scrollX = this.scene.cameras.main.scrollX;
        for (let i = 0; i < this.entryList.length; i++) {
          const current = this.entryList[i];
          if (moveLength < 0) {
            //右往左滑动
            if (scrollX - width / 6 > current.x - width / 2) {
              currentIndex++;
            } else {
              break;
            }
          }
          if (moveLength > 0) {
            //左往右滑动
            if (scrollX - width / 6 > current.x - width / 2) {
              currentIndex++;
            } else {
              break;
            }
          }
        }
        this.activeIndex = currentIndex;
        window.localStorage.setItem(StorageKey, this.activeIndex.toString());
        const targetX = { x: this.scene.cameras.main.scrollX };
        scrollTween && scrollTween.pause();
        scrollTween = this.scene.add.tween({
          targets: targetX,
          x: this.entryList[currentIndex].x - width / 2,
          // ease: "Quart.easeOut",
          duration: 250,
          onUpdate: () => {
            this.scene.cameras.main.scrollX = targetX.x;
            this.scaleEntry();
          },
        });
      },
      this
    );
    this.scene.input.on('pointerupoutside', (pointer) => {
      this.scene.input.emit("pointerup", pointer)
    })
  }
}