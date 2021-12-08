/**
 * 封装Tweens为异步函数的方式
 * @param scene 场景的实例
 * @param config Tweens配置
 */
export function asyncTween(
  scene: Phaser.Scene,
  config: object | Phaser.Types.Tweens.TweenBuilderConfig
) {
  return new Promise((rsolve, reject) => {
    const tween = scene.add.tween(
      Object.assign({}, config, {
        onComplete: () => rsolve(tween),
      })
    );
  });
}
/**
 * 在当前代码停留duration毫秒
 * @param scene  场景的实例
 * @param duration 停留时间，毫秒
 */
export function sleep(scene: Phaser.Scene, duration: number) {
  return new Promise((rsolve, reject) => {
    const tween = scene.add.tween({
      targets: { aa: 1 },
      aa: 0,
      duration,
      onComplete: () => rsolve(tween),
    });
  });
}

/**
 * 产生id
 */
export function createId() {
  return Date.now() + Math.floor(Math.random() * 10000).toString();
}
/**
 * 获取对象在世界上下左右分别四个方向的距离(适用于gameobject在Container中的情况)
 * @param gameObject
 */
export function getRect(
  gameObject: Phaser.GameObjects.Container | Phaser.GameObjects.Zone|Phaser.GameObjects.Image
) {
  let left = 0;
  let top = 0;
  let c = gameObject;
  while (c) {
    // 多个容器嵌套的情况
    left += c.x;
    top += c.y;
    c = c.parentContainer;
  }
  let right = left + gameObject.width;
  let bottom = top + gameObject.height;
  return { left, right, top, bottom };
}
/**
 * pointer是否在Container对象范围内
 */
/*
export function isInRect(
  pointer,
  gameObject: Phaser.GameObjects.GameObject,
  rect?: any
) {
  const _rect = rect ? rect : getRect(<Phaser.GameObjects.Container>gameObject);
  return (
    pointer.y > _rect.top &&
    pointer.y < _rect.bottom &&
    pointer.x > _rect.left &&
    pointer.x < _rect.right
  );
}
*/
export function gridIndex2Px(
  list: Array<{ x: number; y: number; [propName: string]: any }>
): Array<{ x: number; y: number; [propName: string]: any }> {
  return list.map((item) => ({
    ...item,
    x: (item.x - 1) * 102,
    y: (item.y - 1) * 102,
  }));
}

export function json2URL(json: object) {
  const blobTmp = new Blob([JSON.stringify(json)], {
    type: "application/json",
  });
  return URL.createObjectURL(blobTmp);
}

/**
 * 利用洗牌算法对数组进行随机打乱
 * @param list
 * @returns
 */
export function shuffle2Array(list: Array<any>): Array<any> {
  const _list = [...list];
  /**
   * 洗牌算法
   */
  for (let i = list.length - 1; i > 0; i--) {
    let rand = Math.round(Math.random() * i);
    let temp = _list[i];
    _list[i] = _list[rand];
    _list[rand] = temp;
  }
  for (let i = list.length - 1; i > 0; i--) {
    let rand = Math.round(Math.random() * i);
    let temp = _list[i];
    _list[i] = _list[rand];
    _list[rand] = temp;
  }
  return _list;
}


/**
 * 根据csv的文件数据，获取地图瓦片数据
 * @param arr 
 */
 export function csvArr2Tiles(arr) {
  const tiles = [];
  for (const y in arr) {
    for (const x in arr[y]) {
      if (arr[y][x]) {
        const cell = (<string>arr[y][x]).split("/");
        for (const index in cell) {
          cell[index] !== "0" && // 0为没有瓦片
            tiles.push({ x: +x + 1, y: +y + 1, tileType: cell[index] });
        }
      }
    }
  }
  return tiles;
}