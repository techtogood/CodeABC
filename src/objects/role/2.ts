/**
 * 游戏角色:老虎
 */

/**
 * 角色2
 * 注意：仅和角色1的底部投影不同
 */
 import BaseRole from "@/objects/role/baseRole_v3";
export default class Role extends BaseRole {
  static roleType = "role_2";
  constructor(param: ContainerParams) {
    super({ ...param, roleTexture: Role.roleType });
  }
}
