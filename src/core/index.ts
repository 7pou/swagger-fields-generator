import { MessageType } from "~common/messageType";
import { getExtensionInfo, setDefaultStorageConfig, setExtensionInfo, setOptionsPageParams } from "~storage/app";
import { generatorStorageGetByUuid } from "~storage/generator";
import { globalConfigStorageGet } from "~storage/global";
import { type ProjectConfigProps } from "~storage/project";
import { findChild, stringSplit } from "~utils";
import bgrun from "~utils/bgrun";
import eventBus from "~utils/eventBus";

const INSERT_MARKER = 'inserted'

export const elMaskGet = (el: Element) => {
    return el.getAttribute(INSERT_MARKER) === 'true'
}
export const elMaskSet = (el: Element) => {
    return el.setAttribute(INSERT_MARKER, 'true')
}
export const elMaskRemove = (el: Element) => {
    return el.removeAttribute(INSERT_MARKER)
}

/** 生成按钮集合 */
export const createBtns = async (projectConfig: ProjectConfigProps, summary: HTMLElement, json) => {
    // 获取生成配置列表
    const generatorList = await generatorStorageGetByUuid(stringSplit(projectConfig.btns))
    // 按钮容器
    const $btnBox = document.createElement('div')
    $btnBox.classList.add('opblock-btns')
    const globalConfig = await globalConfigStorageGet()
    for(let i = 0; i < generatorList.length; i++) {
        const generator = generatorList[i]
        if (!generator.enable) continue

        // 创建按钮, 绑定点击事件
        const $btn = document.createElement('button')
        $btn.innerText = generator.btnName
        if (i+1 > globalConfig.maxBtn ) {
          $btn.classList.add('btn-collapse')
        }
        $btn.onclick = (e) => {
          bgrun.fireEvent('click', {page: 'swagger页面', type: '生成代码', action: generator.btnName})
          e.stopPropagation()
          const path = findChild(summary, '.opblock-summary-path')?.innerText
          if (!path) return
          const method = findChild(summary, '.opblock-summary-method')?.innerText?.toLowerCase()
          const schema = json?.paths[path][method] || {error: true, message: chrome.i18n.getMessage('load_json_error')}

          const url = chrome.runtime.getURL("sandbox.html")
          openCenteredWindow(url).then((sandbox) => {
              sandbox.postMessage({ type: MessageType.SENDBOX_EXECUTE, code: generator.code, json, input: {path, method, ...schema} }, "*");
          });
        }
        $btnBox.appendChild($btn)
    }

    if(generatorList.length > globalConfig?.maxBtn) {
      const $collapseBtn = document.createElement('button')
      $collapseBtn.innerText = '>>'
      $collapseBtn.onclick = () => {
        if ($btnBox.classList.contains('open')) {
          $collapseBtn.innerText = '>>'
        } else {
          $collapseBtn.innerText = '<<'
        }
        $btnBox.classList.toggle('open')
      }
      $btnBox.appendChild($collapseBtn)
    }
    return $btnBox
}


/** 找到所有的summary, 并把按钮集合插入至summary */
export const insertOpblockBtns = async (projectConfig: ProjectConfigProps, json) => {
    const array = document.querySelectorAll('.opblock-summary')
    for (let i = 0; i < array.length; i++) {
        const element = array[i] as HTMLElement;
        const btnsEL = await createBtns(projectConfig, element, json)
        elMaskSet(element)
        element.appendChild(btnsEL)
    }
}

/** 获取href通过tabs  */
export const getCurrentUrlByChromeTabs = () => {
    return new Promise<URL | null>((resolve, reject) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length > 0) {
                const currentUrl = tabs[0].url;
                const url = new URL(currentUrl)
                resolve(url)
            } else {
                resolve(null)
            }
        });
    })
}

/** 打开沙盒窗口, 并返回窗口已经loaded的实例 */
function openCenteredWindow(url) {
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;

    const windowWidth = 800;
    const windowHeight = screenHeight - 200;

    const left = (screenWidth - windowWidth) / 2;
    const top = (screenHeight - windowHeight) / 2;

    const windowOptions = `width=${windowWidth},height=${windowHeight},top=${top},left=${left},resizable=yes,scrollbars=yes,location=no`;
    const sandbox = window.open(url, "_blank", windowOptions)
    return new Promise<Window>((resolve, reject) => {
        window.addEventListener("message", function listener(event) {
            if (event.data.type === MessageType.SENDBOX_LOADED) {
                resolve(sandbox)
                window.removeEventListener("message", listener);
            }
        });
    })
}


export const openOptionsPage = (params: {tab: 'global' | 'project' | 'generator' | 'help', id?: string} = {tab: 'global'}) => {
  setOptionsPageParams(params)
  eventBus.emit(MessageType.OPTIONS_PARAMS, params)
  chrome.runtime.openOptionsPage()
}


export const installExtention = async () => {
  const ext = await getExtensionInfo()

  if (!ext.installDate) {
    const clientId = self.crypto.randomUUID()
    ext.installDate = new Date().toLocaleDateString()
    ext.lastUpdate = new Date().toLocaleDateString()
    ext.version = chrome.runtime.getManifest().version
    ext.clientId = clientId
    await setExtensionInfo(ext)
    await setDefaultStorageConfig()
  }
}
