/**
 * 角色1
 */
import BaseRole from "@/objects/role/baseRole_v3";
export default class Role extends BaseRole {
  static roleType = "role_1";
  constructor(param: ContainerParams) {
    super({ ...param, roleTexture: Role.roleType });
  }
}
