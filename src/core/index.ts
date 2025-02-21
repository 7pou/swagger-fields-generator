import { MessageType } from "~common/messageType";
import { generatorStorageGetByUuid } from "~storage/generator";
import { globalConfigStorageGet } from "~storage/global";
import { type ProjectConfigProps } from "~storage/project";
import { findChild, stringSplit } from "~utils";

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
    const btnsEL = document.createElement('div')
    btnsEL.classList.add('opblock-btns')
    const globalConfig = await globalConfigStorageGet()
    for(let i = 0; i < generatorList.length; i++) {
        const generator = generatorList[i]
        if (!generator.enable) continue

        // 创建按钮, 绑定点击事件
        const btnEL = document.createElement('button')
        btnEL.innerText = generator.btnName
        if (i+1 > globalConfig.maxBtn ) {
          btnEL.classList.add('btn-collapse')
        }
        btnEL.onclick = (e) => {
            e.stopPropagation()
            const path = findChild(summary, '.opblock-summary-path')?.innerText
            const method = findChild(summary, '.opblock-summary-method')?.innerText?.toLowerCase()
            const schema = json?.paths[path][method] || {error: true, message: chrome.i18n.getMessage('load_json_error')}

            const url = chrome.runtime.getURL("sandbox.html")
            openCenteredWindow(url).then((sandbox) => {
                sandbox.postMessage({ type: MessageType.EXECUTE, code: generator.code, json, input: {path, method, ...schema} }, "*");
            });
        }
        btnsEL.appendChild(btnEL)
    }

    if(generatorList.length > globalConfig?.maxBtn) {
      const collapseBtn = document.createElement('button')
      collapseBtn.innerText = '>>'
      collapseBtn.onclick = () => {
        if (btnsEL.classList.contains('open')) {
          collapseBtn.innerText = '>>'
        } else {
          collapseBtn.innerText = '<<'
        }
        btnsEL.classList.toggle('open')
      }
      btnsEL.appendChild(collapseBtn)
    }
    return btnsEL
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
    return new Promise<string | null>((resolve, reject) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length > 0) {
                const currentUrl = tabs[0].url;
                resolve(decodeURIComponent(currentUrl))
            } else {
                resolve(null)
            }
        });
    })
}

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
