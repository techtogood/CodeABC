```shell
├── docs #文档
|  └── tree.js #生成目录结构
├── index.html #vite 入口文件
├── package-lock.json
├── package.json
├── public
|  ├── fonts #使用的字体
|  |  └── Alibaba-PuHuiTi-Medium.ttf
|  ├── phaser.min.js #游戏引擎
|  └── webfont.js #加载字体
├── README.md
├── src
|  ├── assets #游戏中加载的静态资源
|  |  ├── animations
|  |  |  └── animations.json
|  |  ├── audio
|  |  |  ├── bgm_1.mp3
|  |  |  ├── click.mp3
|  |  |  ├── click_2.mp3
|  |  |  ├── fail.mp3
|  |  |  ├── get.mp3
|  |  |  ├── mistake.wav
|  |  |  └── victory.mp3
|  |  ├── image
|  |  |  ├── blockly
|  |  |  ├── objects
|  |  |  └── role
|  |  ├── packs #批量加载资源使用的配置文件
|  |  |  ├── audio-files.ts
|  |  |  ├── base-pack.ts
|  |  |  ├── blockly-files.ts
|  |  |  ├── objects-files.ts
|  |  |  ├── pack.js
|  |  |  └── role-files.ts
|  |  └── sprites
|  ├── config #所有关卡游戏配置的汇总
|  |  └── main.ts
|  ├── decorators #装饰器
|  |  └── index.ts
|  ├── enum #枚举值
|  |  └── index.ts
|  ├── game.ts #游戏入口
|  ├── helpers #解析animations.json
|  |  └── animation-helper.ts
|  ├── objects 游戏中通用的GameObject
|  |  ├── backBtn.ts
|  |  ├── baseEntryMap.ts
|  |  ├── blockly
|  |  |  ├── blockContainer.ts
|  |  |  ├── blockPond
|  |  |  ├── blocks
|  |  |  ├── colorParamBubbleBox
|  |  |  ├── dropZone.ts
|  |  |  ├── getTexture.ts
|  |  |  ├── index.ts
|  |  |  ├── infiniteBlockContainer.ts
|  |  |  ├── numberParamBubbleBox
|  |  |  ├── runPanel
|  |  |  └── scrollBar.ts
|  |  ├── countGoldBoard.ts
|  |  ├── dialog.ts
|  |  ├── levelPanel.ts
|  |  ├── rewardDialog.ts
|  |  ├── role
|  |  |  ├── 1.ts
|  |  |  ├── 2.ts
|  |  |  ├── 3.ts
|  |  |  ├── baseRole.ts
|  |  |  └── index.ts
|  |  ├── scoreBoard.ts
|  |  └── tiles
|  |     ├── baseTiles.ts
|  |     ├── clover.ts
|  |     ├── end.ts
|  |     ├── index.ts
|  |     └── water.ts
|  ├── plugins #phaser中使用的自定义插件
|  |  ├── musicManager.ts
|  |  └── router.ts
|  ├── scenes #游戏中场景
|  |  ├── baseEntryScene.ts #父类，被关卡入口的子类继承
|  |  ├── baseSubject_2_3.ts #父类，被主题二，三的关卡场景继承
|  |  ├── boot-scene.ts #加载资源使用的场景
|  |  └── main-scene.ts #游戏主场景
|  ├── subject_1 #主题一
|  |  ├── assets
|  |  |  ├── image
|  |  |  └── packs
|  |  ├── config #这个主题中的游戏配置
|  |  |  ├── gameLevelEntry.ts #关入口配置
|  |  |  ├── index.ts #汇总配置
|  |  |  └── levelConfigs #关卡内容配置
|  |  └── scenes
|  |     ├── entry-scene.ts
|  |     ├── index.ts
|  |     └── scene_1.ts
|  ├── subject_2
|  |  ├── assets
|  |  |  ├── image
|  |  |  └── packs
|  |  ├── config
|  |  |  ├── gameLevelEntry.ts
|  |  |  ├── index.ts
|  |  |  └── levelConfigs
|  |  ├── objects #这个主题使用的通用GameObject
|  |  |  ├── baseSubjectTiles.ts
|  |  |  └── tiles #关卡内使用的瓦片素材
|  |  └── scenes
|  |     ├── entry-scene.ts
|  |     ├── index.ts
|  |     └── scene_1.ts
|  ├── subject_3
|  |  ├── assets
|  |  |  ├── image
|  |  |  └── packs
|  |  ├── config
|  |  |  ├── gameLevelEntry.ts
|  |  |  ├── index.ts
|  |  |  └── levelConfigs
|  |  ├── objects
|  |  |  ├── baseSubjectTiles.ts
|  |  |  └── tiles
|  |  └── scenes
|  |     ├── entry-scene.ts
|  |     ├── index.ts
|  |     └── scene_1.ts
|  ├── subject_4
|  |  ├── assets
|  |  |  ├── image
|  |  |  └── packs
|  |  ├── config
|  |  |  ├── gameLevelEntry.ts
|  |  |  ├── index.ts
|  |  |  └── levelConfigs
|  |  ├── objects
|  |  |  ├── baseSubjectTiles.ts
|  |  |  └── tiles
|  |  └── scenes
|  |     ├── entry-scene.ts
|  |     ├── index.ts
|  |     └── scene_1.ts
|  ├── subject_5
|  |  ├── assets
|  |  |  ├── image
|  |  |  └── packs
|  |  ├── config
|  |  |  ├── gameLevelEntry.ts
|  |  |  ├── index.ts
|  |  |  └── levelConfigs
|  |  ├── objects
|  |  |  ├── brand
|  |  |  ├── bricks
|  |  |  ├── car
|  |  |  ├── drinks
|  |  |  ├── goods
|  |  |  ├── letters
|  |  |  └── robotArm
|  |  └── scenes
|  |     ├── entry-scene.ts
|  |     ├── index.ts
|  |     ├── scene_1.ts
|  |     ├── scene_2.ts
|  |     ├── scene_3.ts
|  |     └── scene_4.ts
|  └── utils #工具方法
|     ├── gameStorage.ts
|     └── index.ts
├── strategy #每个关卡的答案截图
├── tsconfig.json #typescript配置
├── typings #ts中的类型声明
|  ├── block.d.ts
|  ├── custom.d.ts
|  ├── index.d.ts
|  ├── phaser.d.ts
|  ├── role.d.ts
|  └── tiles.d.ts
├── vite.config.js #vite的配置
└── yarn.lock
```

