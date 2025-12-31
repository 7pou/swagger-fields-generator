import type { PlasmoCSConfig } from "plasmo"
import "~utils/eventBus"
import { createBtns, elMaskGet, elMaskSet, insertOpblockBtns, installExtention } from "~core"
import { globalConfigStorageGet } from "~storage/global"
import { projectStorageGetByHost, projectStorageUpdate } from "~storage/project"
import { findTarget } from "~utils"
import { requestSource } from "~utils/requestSource"
import '../styles/content.scss'
import eventBus from "~utils/eventBus"
import { MessageType } from "~common/messageType"
import SwaggerParser from '@apidevtools/swagger-parser'
export const config: PlasmoCSConfig = {
  // matches: ["https://www.plasmo.com/*"]
}
window.addEventListener("message", (e) => {
  if (e.data.type === 'log') {
    console.log(e.data.data)
  }
})
eventBus.on(MessageType.LOG, (...data) => {
  console.log(...data);
})
eventBus.on(MessageType.INSERT_OPBLOCK_BTNS, async(data) => {

  const { projectConfig, rawData } = data
  const dereferencedData = await SwaggerParser.dereference(rawData)

  insertOpblockBtns(projectConfig, dereferencedData)
})
window.addEventListener("load", async() => {

  // 安装扩展
  await installExtention()

  // 获取全局配置
  const global = await globalConfigStorageGet()

  // 如果全局配置未开启, 则终止执行
  if (!global.enable) return

  // 获取项目配置
  const project = await projectStorageGetByHost(location.origin + location.pathname)

  // 如果项目配置未开启, 则终止执行
  if (!project || project.enable !== true) return

  // 请求源数据
  const rawData = await requestSource(location.origin)


  // 更新项目是否请求成功的标志
  projectStorageUpdate({...project, loadJsonSuccess: !!rawData})

  // 插入按钮
  let dereferencedData = null
  if (rawData) {
    dereferencedData = await SwaggerParser.dereference(rawData)
    await insertOpblockBtns(project, dereferencedData)
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
        const btnsEL = await createBtns(project, summary, dereferencedData)

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
 * 埋点/帮助页设计/全局配置加字段/错误页面/默认的生成器配置/readme.md文件修改/湘创api格式问题修复
*/
