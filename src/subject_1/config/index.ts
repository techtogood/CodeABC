/**
 * @file 菜单（关卡）场景的配置  基于左上角定位
 */
import packJson from "../assets/packs/index";
import levelConfigs from "./levelConfigs";
/**
 * 关卡入口坐标
 */
const levelEntryConfigs = [
  { x: 410, y: 622 },
  { x: 600, y: 379 },
  { x: 859, y: 285 },
  { x: 1056, y: 535 },
  { x: 1291, y: 745 },
  { x: 1593, y: 645 },
  { x: 1908, y: 552 },
  { x: 2267, y: 699 },
  { x: 2559, y: 573 },
  { x: 2887, y: 389 },
  { x: 3216, y: 509 },
  { x: 3528, y: 628 },
  { x: 3835, y: 475 },
  { x: 4163, y: 361 },
  { x: 4536, y: 456 },
  { x: 4799, y: 626 },
].map((item, index) => ({
  level: index + 1,
  x: item.x,
  y: item.y,
  open: true,
  key: "subject_1_map_level_entry_" + (index + 1),
}));
export default {
  subject: 1,
  sceneKey: "Subject_1_EntryScene", // 场景
  packJson, // 素材资源
  mapTiles: [
    {
      key: "subject_1_map_scene_1", //地图纹理
      decoration: [
        // { x: 332, y: 207, key: "subject_1_map_lion", depth: 1 },
      ],
    },
    {
      key: "subject_1_map_scene_2", //地图纹理
      decoration: [],
    },
  ],
  levelEntryConfigs,
  levelConfigs,
};
