/**
 * @flie
 * 加载场景
 */
import { json2URL } from "@/utils";
export default class BootScene extends Phaser.Scene {
  private loadingBar: Phaser.GameObjects.Graphics;
  private progressBar: Phaser.GameObjects.Graphics;
  private packJson;
  constructor(key) {
    super(key);
  }
  //从scene.start("scene_key",{})或插件this.router.push(sceneKey,data)传递数据
  init({ packJson }) {
    this.packJson = packJson;
  }
  preload(): void {
    this.cameras.main.setBackgroundColor(0x000000);
    this.createLoadingGraphics();
    this.load.on("progress", (value) => {
      this.progressBar.clear();
      this.progressBar.fillStyle(0x88e453, 1);
      this.progressBar.fillRect(
        this.cameras.main.width / 4,
        this.cameras.main.height / 2 - 16,
        (this.cameras.main.width / 2) * value,
        16
      );
    });
    this.load.on("complete", () => this.destroyProgress());
    if (this.packJson && !this.cache.json.exists("preload_" + this.scene.key)) {
      const packJsonURL = json2URL(this.packJson);
      this.load.pack("preload_" + this.scene.key, packJsonURL);
    } else {
      this.destroyProgress();
    }
  }
  destroyProgress() {
    this.progressBar.destroy();
    this.loadingBar.destroy();
    this.cameras.main.setBackgroundColor("rgba(0,0,0,0)");
  }
  private createLoadingGraphics(): void {
    this.loadingBar = this.add.graphics();
    this.loadingBar.fillStyle(0xffffff, 1);
    this.loadingBar.fillRect(
      this.cameras.main.width / 4 - 2,
      this.cameras.main.height / 2 - 18,
      this.cameras.main.width / 2 + 4,
      20
    );
    this.progressBar = this.add.graphics();
  }
  create() {}
}
