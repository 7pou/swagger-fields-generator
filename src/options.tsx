import { useEffect, useState } from "react"
import GlobalConfig from "~container/GlobalConfig"
import ProjectConfig from "~container/ProjectConfig"
import GeneratorConfig from "~container/GeneratorConfig"
import './styles/options.scss'
import './styles/iconfont.css'
import { analytics } from "~utils/analytics"
import 'https://www.googletagmanager.com/gtag/js?id=$PLASMO_PUBLIC_GTAG_ID'
import Help from "~container/Help"
import ErrorBoundary from "~components/ErrorBoundary"
import ErrorWarning from "~container/ErrorWarning"
function IndexOptions() {
  const [tab, setTab] = useState(0)
  useEffect(() => {
    analytics()
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
              {tab === 3 && <Help />}
            </ErrorBoundary>
          </div>
        </div>
        <div className="footer"></div>
    
      </div>
  )
}

export default IndexOptions
