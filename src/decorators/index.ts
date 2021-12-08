/**
 * 为瓦片设置纹理的类型（纹理文件名）
 * @param tileType
 * @returns
 */
export function setTileType(tileType) {
  return function (target) {
    target.tileType = tileType;
  };
}
/**
 * 为瓦片设置纹理类型的前缀
 * @param tileType
 * @returns
 */
 export function setTextureKeyPrefix(prefix) {
  return function (target) {
    target.textureKeyPrefix = prefix;
  };
}

/**
 * 为瓦片设置纹理类型的前缀
 * @param tileType
 * @returns
 */
 export function setColliderType(colliderType) {
  return function (target) {
    target.colliderType = colliderType;
  };
}
