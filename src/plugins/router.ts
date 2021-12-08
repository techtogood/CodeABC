/**
 * 处理场景的前进与返回,传递并保存了切换到场景所需要的游戏配置
 */
type Item = {
  path: string;//目标场景的key
  data?: {
    packJson?: Game.PackJson;//游戏资源配置
    levelConfigs?: Array<any>;//关卡数据
  };
};
export default class Router extends Phaser.Plugins.BasePlugin {
  private history: Item[] = []; //历史路由（不包括当前）
  private route: Item; //当前路由
  constructor(pluginManager) {
    super(pluginManager);
  }
  /**
   * 钩子函数
   * @param initData
   */
  init(initData) {
    this.history = [];
    this.route = {
      path: initData.path,
    };
  }
  // 返回到主场景（游戏主题分类场景）
  home() {
    this.game.scene.start("MainScene").stop(this.route.path, this.route.data);
    this.init({ path: "MainScene" });
  }
  // 重定向
  redirect(path: string, data?: object) {
    this.route.path !== path &&
      this.game.scene.stop(this.route.path, this.route.data);
    this.game.scene.start(path, data);
    this.route = {
      path,
      data,
    };
  }
  // 切换
  push(path: string, data?: object) {
    this.game.scene.start(path, data).stop(this.route.path, this.route.data); //data可传到shutdown
    this.history.push({ ...this.route });
    this.route = {
      path,
      data,
    };
  }
  // 返回上一场景
  back() {
    const target = this.history.pop();
    if (target) {
      this.game.scene
        .start(target.path, target.data)
        .stop(this.route.path, this.route.data);
      this.route = target;
    }
  }
  // todo：过渡效果切换场景
  transition(scene: Phaser.Scene, path: string, data?: object) {}
}
