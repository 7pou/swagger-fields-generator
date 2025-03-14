import { useEffect, useState } from "react"
import GlobalConfig from "~container/GlobalConfig"
import ProjectConfig from "~container/ProjectConfig"
import GeneratorConfig from "~container/GeneratorConfig"
import './styles/options.scss'
import './styles/iconfont.css'
import Help from "~container/Help"
import ErrorBoundary from "~components/ErrorBoundary"
import ErrorWarning from "~container/ErrorWarning"
import { getOptionsPageParams } from "~storage/app"
import { MessageType } from "~common/messageType"
function IndexOptions() {
  const [tab, setTab] = useState(0)
  const tabmap = {
    'global': 0,
    'generate': 1,
    'project': 2,
    'help': 3,
  }

  useEffect(() => {
    getOptionsPageParams().then((params: any) => {
      if (params?.tab && tabmap[params.tab] !== undefined) {
        setTab(tabmap[params.tab])
      }
    })
    chrome.runtime.onMessage.addListener((message: any) => {
      if (message?.type === MessageType.OPTIONS_PARAMS) {
        setTab(tabmap[message.params.tab])
      }
    })

  }, [])

  return (
      <div className="swagger-fields-generator-options-page">
        <div className="header"></div>
        <div className="body">
          <div className="menus">
            <div className={"menu-item " + (tab === 0 ? ' on' : '')} onClick={() => setTab(0)}>
              <i className="iconfont icon-shezhi"></i>
              <span>{chrome.i18n.getMessage('global_page')}</span>
            </div>
            <div className={"menu-item " + (tab === 1 ? ' on' : '')} onClick={() => setTab(1)}>
              <i className="iconfont icon-AIGC"></i>
              <span>{chrome.i18n.getMessage('generate_page')}</span>
            </div>
            <div className={"menu-item " + (tab === 2 ? ' on' : '')} onClick={() => setTab(2)}>
              <i className="iconfont icon-project"></i>
              <span>{chrome.i18n.getMessage('project_page')}</span>
            </div>
            <div className={"menu-item " + (tab === 3 ? ' on' : '')} onClick={() => setTab(3)}>
              <i className="iconfont icon-help"></i>
              <span>{chrome.i18n.getMessage('help')}</span>
            </div>
          </div>
          <div className="content">
            <ErrorBoundary errorNode={<ErrorWarning />}>
              {tab === 0 && <GlobalConfig />}
              {tab === 1 && <GeneratorConfig />}
              {tab === 2 && <ProjectConfig />}
            </ErrorBoundary>
            {tab === 3 && <Help />}
          </div>
        </div>
        <div className="footer"></div>

      </div>
  )
}

export default IndexOptions
