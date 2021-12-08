interface Param {
  scene: Phaser.Scene;
  x: number;
  y: number;
  onScroll?(scrollTop: number): void;
  texture: {
    scrollBar: string;
    slider: string;
  }
}
export default class ScrollBar extends Phaser.GameObjects.Container {
  scrollBarBg: Phaser.GameObjects.Image;
  slider: Phaser.GameObjects.Image;
  maxScroll = 0;
  onScroll: (scrollTop: number) => void;
  constructor(param: Param) {
    super(param.scene, param.x, param.y);
    // 滚动条
    this.scrollBarBg = param.scene.add
      .image(0, 0, param.texture.scrollBar)
      .setOrigin(0.5, 0);

    this.slider = param.scene.add
      .image(0, 15, param.texture.slider)
      .setOrigin(0.5, 0);
    this.add([this.scrollBarBg, this.slider]);
    this.scrollBarBg.setX(this.slider.width / 2);
    this.slider.setX(this.slider.width / 2);
    this.setSize(this.slider.width, this.scrollBarBg.height)
    this.maxScroll = this.scrollBarBg.height - this.slider.height - 15;
    this.onScroll = param.onScroll
    // 拖动交互
    this.slider.setInteractive();
    param.scene.input.setDraggable(this.slider, true);
    this.slider.on("drag", (pointer, dragX, dragY) => {
      this.slider.y = Phaser.Math.Clamp(dragY, 15, this.maxScroll); //dragY只能为边界内的值
      param.onScroll && param.onScroll((this.slider.y - 15) / (this.maxScroll - 15));
    });
  }
  scrollToTop() {
    this.scene.add.tween({
      targets: this.slider,
      y: 15,
      duration:100,
      onUpdate: () => {
        this.onScroll && this.onScroll((this.slider.y - 15) / (this.maxScroll - 15));
      }
    })
  }
  scrollToBottom() {
    this.scene.add.tween({
      targets: this.slider,
      y: this.maxScroll,
      duration:100,
      onUpdate: () => {
        this.onScroll && this.onScroll((this.slider.y - 15) / (this.maxScroll - 15));
      }
    })
  }
}
