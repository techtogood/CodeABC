/**
 * @file 根据URL的hash值，显示指定关卡的正确答案
 */
// const isMobile = (() => {
//   let info = navigator.userAgent;
//   const agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPod", "iPad"];
//   for (let i = 0; i < agents.length; i++) {
//     if (info.includes(agents[i])) return true;
//   }
//   return false;
// })();
// isMobile && document.body.setAttribute('class', 'mobile')
// //加载该路径下的所有文件
// const modules = Object.assign(
//   {},
//   import.meta.globEager("./subject_1/*.png"),
//   import.meta.globEager("./subject_2/*.png"),
//   import.meta.globEager("./subject_3/*.png"),
//   import.meta.globEager("./subject_4/*.png"),
// );
const pathConfig = [
  { total: 16 },
  { total: 24 },
  { total: 20 },
  { total: 30 },
];
const fg = document.createDocumentFragment()
const dirFg = document.createDocumentFragment()
const subjectStrList = ['', '一', '二', '三', '四', '五', '六', '七']
for (let i = 1; i <= pathConfig.length; i++) {
  const h3 = document.createElement('h3');
  h3.innerText = `主题${subjectStrList[i]}`
  dirFg.append(h3)
  const ul = document.createElement('ul');
  for (let j = 1; j <= pathConfig[i - 1].total; j++) {
    const div = document.createElement('div');
    div.setAttribute('class', 'content');
    div.innerHTML = (`
      <h2 id="subject_${i}_level_${j}">主题${subjectStrList[i]}<span>关卡${j}</span></h2>
      <img loading="lazy" src="./subject_${i}/${j}.png"/>
    `);
    fg.append(div)
    // 目录
    const li = document.createElement('li');
    li.innerHTML = `<a href="#subject_${i}_level_${j}">关卡${j}<a/>`
    ul.append(li)
  }
  dirFg.append(ul)
}
// for (let key in modules) {
//   const div = document.createElement('div')
//   div.setAttribute('class', 'content')
//   const [_, subject, level] = key.replace(/[^(\d\/\d)]/g, "").split('/')
//   div.innerHTML = `
//   <h2>主题${subjectStrList[subject]}<span>关卡${level}</span></h2>
//   <img loading="lazy" src="${modules[key].default}"/>
//   `;
//   fg.append(div)
// }
document.querySelector('#directory').append(dirFg)
document.querySelector('#container').append(fg)
window.location.href = window.location.hash