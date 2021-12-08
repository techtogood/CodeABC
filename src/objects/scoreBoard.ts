/**
 * @flie 分数计算面板
 */
interface Param {
  scene: Phaser.Scene;
  x?: number;
  y?: number;
}
const StorageKey = "totalScore";
export default class ScoreBoard extends Phaser.GameObjects.Container {
  private score = +window.localStorage.getItem(StorageKey) || 0;
  private scoreText: Phaser.GameObjects.Text;
  depth = 999;
  constructor(param: Param) {
    super(param.scene);
    const countGold = param.scene.add
      .image(29, 25, "score_board_star")
      .setOrigin(0, 0);
    const countGoldBg = param.scene.add
      .image(0, 0, "score_board_bg")
      .setOrigin(0, 0);
    this.scoreText = param.scene.add
      .text(105, 28, "", {
        fontFamily: "PuHuiTi",
        fontSize: "48px",
        color: "#FEF6EF",
        align: "center",
        fontStyle: "bold",
        fixedWidth: 105,
        fixedHeight: 65,
        // backgroundColor: "rgba(0,0,0,0.3)",
        baselineY: 2.185,
      })
      .setOrigin(0, 0)
      .setDepth(2);
    this.setScoreText(this.score);
    this.add([countGoldBg, countGold, this.scoreText]);
    this.setPosition(
      param.x || +param.scene.game.config.width - 107 - countGoldBg.width,
      param.y || 26
    );
    this.setSize(countGoldBg.width, countGoldBg.height);
    param.scene.add.existing(this);
  }
  private setScoreText(score) {
    this.scoreText.setText(score.toString().padStart(3, "0"));
  }
  /**
   *
   * @param count 增加金币
   */
  addScore(count) {
    window.localStorage.setItem(StorageKey, this.score + count);
    const taeget = {
      num: 1,
    };
    let score = this.score;
    this.score += count;
    this.scene.add.tween({
      targets: taeget,
      num: 0,
      loop: count,
      duration: 100,
      onLoop: () => {
        score++;
        this.setScoreText(score);
      },
    });
  }
}
