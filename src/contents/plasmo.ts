import type { PlasmoCSConfig } from "plasmo"
import { createBtns, elMaskGet, elMaskSet, insertOpblockBtns } from "~core"
import { globalConfigStorageGet } from "~storage/global"
import { projectStorageGetByHost, projectStorageUpdate } from "~storage/project"
import { findTarget } from "~utils"
import { requestSource } from "~utils/requestSource"

export const config: PlasmoCSConfig = {
  // matches: ["https://www.plasmo.com/*"]
}
window.addEventListener("message", (e) => {
  if (e.data.type === 'log') {
    console.log(e.data.data)
  }
})
window.addEventListener("load", async() => {
  const global = await globalConfigStorageGet()
  if (!global.enable) return
  const data = await requestSource(location.href)
  const project = await projectStorageGetByHost(location.href)
  if (project) {
    projectStorageUpdate({...project, loadJsonSuccess: !!data})
    data && await insertOpblockBtns(project, data)
  }

  // 监听tag点击, 插入按钮
   document.body.addEventListener("click", async(e) => {
    const opblockTag = findTarget(e, '.opblock-tag')
    if (!opblockTag) return
    const opblock = findTarget(e, '.opblock-tag-section')
    setTimeout(async() => {
      const summarys = opblock.querySelectorAll('.opblock-summary')
      for (let i = 0; i < summarys.length; i++) {
        const summary = summarys[i] as HTMLElement;

        if (elMaskGet(summary)) return
        elMaskSet(summary)
        const btnsEL = await createBtns(project, summary, data)

        summary.appendChild(btnsEL)
      }
    }, 100);
  })
})

/***
 * 页面加载判断是否开启了配置
 *  如果开启, 获取JSON数据
 *    如果获取成功, 插入按钮到页面中
 *    如果获取失败, 清空当前项目的json配置
 *  如果没有开启, 无操作
 *
 * 打开弹窗页面
 *  获取根据url获取项目配置
 *    如果配置为空, 则状态为关闭, 不进行操作
 *    如果配置不为空, 则状态为开启
 *      如果获取数据成功, 添加成功的提示文字到弹窗中
 *      如果获取数据失败, 添加失败的提示文字到弹窗中
 *
 * 当点击弹窗的开关按钮时
 *  如果是关闭状态, 则将配置开启, 再次获取配置数据, 通知content再次获取数据
 *    如果项目配置为空, 则新增一个项目配置
 *  如果是开启状态, 则将配置关闭, 通知content移除按钮
 *
 * 当点击弹窗的异常按钮时
 *  打开配置页
 *
 *
 * 埋点/schema2ts/帮助页设计/恢复默认配置/全局配置加字段/最大显示按钮盒子/错误页面/弹出可打开帮助/弹出可打开项目配置
*/
