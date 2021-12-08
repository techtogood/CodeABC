/**
 * @file 主题一每个关卡的数据，配置
 */
type Config = {
  sceneKey: string;
  bg: string; //关卡背景
  level: number; //所在关卡
  data: {
    filled?: Array<number>; //已填充的方块的索引，-1代表未填充，其余对应blocks的index
    answer?: Array<number>; //答案,对应blocks的index
    cueBoard?: string; //提示板
    blocksCount?: number; // block总数，用于生成block的纹理字符串
    blocks?: Array<string>; //block纹理
  };
  reward?: {
    total: number; //奖励的货币
  };
};
const levelConfigs: Array<Config> = [
  // 1-8关卡数据
  {
    level: 1,
    data: {
      filled: [0, 1, -1],
      blocksCount: 3,
    },
    reward: {
      total: 1,
    },
  },
  {
    level: 2,
    data: {
      filled: [1, 0, -1],
      blocksCount: 3,
    },
    reward: {
      total: 1,
    },
  },
  {
    level: 3,
    data: {
      filled: [-1, 1, -1],
      blocksCount: 3,
    },
    reward: {
      total: 1,
    },
  },
  {
    level: 4,
    data: {
      blocksCount: 4,
    },
    reward: {
      total: 1,
    },
  },
  {
    level: 5,
    data: {
      blocksCount: 4,
    },
    reward: {
      total: 1,
    },
  },
  {
    level: 6,
    data: {
      blocksCount: 4,
    },
    reward: {
      total: 2,
    },
  },
  {
    level: 7,
    data: {
      blocksCount: 4,
    },
    reward: {
      total: 2,
    },
  },
  {
    level: 8,
    data: {
      blocksCount: 4,
    },
    reward: {
      total: 2,
    },
  },
  {
    level: 9,
    data: {
      blocksCount: 4,
    },
    reward: {
      total: 2,
    },
  },
  {
    level: 10,
    data: {
      blocksCount: 4,
    },
    reward: {
      total: 3,
    },
  },
  {
    level: 11,
    data: {
      blocksCount: 4,
    },
    reward: {
      total: 3,
    },
  },
  {
    level: 12,
    data: {
      blocksCount: 4,
    },
    reward: {
      total: 3,
    },
  },
  {
    level: 13,
    data: {
      blocksCount: 4,
    },
    reward: {
      total: 3,
    },
  },
  {
    level: 14,
    data: {
      blocksCount: 4,
    },
    reward: {
      total: 3,
    },
  },
  {
    level: 15,
    data: {
      blocksCount: 4,
    },
    reward: {
      total: 3,
    },
  },
  {
    level: 16,
    data: {
      blocksCount: 4,
    },
    reward: {
      total: 3,
    },
  },
].map((item: any) => ({
  sceneKey: "Subject_1_Scene_1",
  bg: item.bg || "subject_1_bg_1",
  level: item.level,
  data: {
    filled: item.data.filled || [-1, -1, -1], //已填充的block的索引,-1代表未填充
    answer: item.data.answer || [0, 1, 2], //正确block的索引及对应的顺序
    cueBoard: item.data.cueBoard || `subject_1_level_${item.level}_cue_board`, //提示板
    // 根据配置的block数量生成对应的纹理key
    blocks: item.data.blocksCount
      ? new Array(item.data.blocksCount)
          .fill(1)
          .map(
            (_, index2) => `subject_1_level_${item.level}_block_${index2 + 1}`
          )
      : item.data.blocks,
  },
  reward: item.reward,
}));
export default levelConfigs;
