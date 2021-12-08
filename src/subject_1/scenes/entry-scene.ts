/**
 * @file 主题一关卡入口
 */
import Config_Subject_1 from "../config/index";
import BaseEntryScene from "@/scenes/baseEntryScene";
export default class Subject_1_EntryScene extends BaseEntryScene {
  constructor() {
    super({
      key: "Subject_1_EntryScene",
      subjectConfig: Config_Subject_1,
    });
  }
  /**
   * @override
   */
  /**
   * 创建关卡入口
   */
  createLevelEntry() {
    super.createLevelEntry();
    // debug 快速进入关卡
    // -------------------
    const level = 0;
    level > 0 &&
      this.router.push(Config_Subject_1.levelConfigs[level - 1].sceneKey, {
        levelConfig: Config_Subject_1.levelConfigs[level - 1],
      });
  }
}
