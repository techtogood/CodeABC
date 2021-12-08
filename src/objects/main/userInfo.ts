
/**
 * @file 用户头像
 */
import defaultUserIcon from '@/assets/image/main/user_icon.png';
type Param = {
  text: string;
  icon?: string;
} & ContainerParams;
export default class UserInfo extends Phaser.GameObjects.Container {
  constructor(param: Param) {
    super(param.scene, param.x, param.y)
    const dom = param.scene.add.dom(0,0, createUserInfoDOM(param.text, param.icon)).setOrigin(0,0)
    this.add([dom])
    param.scene.add.existing(this);
  }
}
function createUserInfoDOM(text: string, iconURL?: string) {
  const DOMID = "userInfo"
  const domStr = (
    `
    <div id="${DOMID}">
      <div style="height: 120px; display: flex; align-items: center">
        <div
          style="
            height: 110px;
            width: 110px;
            border-radius: 50%;
            border: 5px solid rgba(255, 255, 255, 0.9);
            overflow: hidden;
          "
        >
          <img
            src="${iconURL || defaultUserIcon}"
            style="width: 100%; height: 100%"
          />
        </div>
        <div
          style="
            height: 88px;
            padding: 0 71px 0 93px;
            margin-left: -70px;
            text-align: center;
            font-size: 36px;
            line-height: 88px;
            color: #ffffe0;
            font-family: PuHuiTi;
            font-weight: bold;
            background-color: rgba(15, 42, 108, 0.25);
            border-radius: 44px;
            position: relative;
            z-index: -1;
          "
        >
          ${text}
        </div>
      </div>
    </div>
    `
  );
  const newDom = document.createElement('div');
  newDom.innerHTML = domStr;
  let container = document.querySelector('#temp-container')
  if (!container) {
    container = document.createElement('div')
    container.id = "temp-container"
    container.setAttribute('style', "display:none");
    container.append(newDom)
    document.body.append(container)
  } else {
    const dom = document.querySelector('#DOMID')
    dom && dom.remove();
    container.append(newDom)
  }


  return `#${DOMID}`
}