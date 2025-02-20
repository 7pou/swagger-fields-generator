import { useEffect, useState } from "react"
import GlobalConfig from "~container/GlobalConfig"
import ProjectConfig from "~container/ProjectConfig"
import GeneratorConfig from "~container/GeneratorConfig"
import './styles/options.scss'
import { analytics } from "~utils/analytics"
import 'https://www.googletagmanager.com/gtag/js?id=$PLASMO_PUBLIC_GTAG_ID'
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
          <div className={"menu-item " + (tab === 0 ? ' on' : '')} onClick={() => setTab(0)}>全局配置</div>
          <div className={"menu-item " + (tab === 1 ? ' on' : '')} onClick={() => setTab(1)}>生成配置</div>
          <div className={"menu-item " + (tab === 2 ? ' on' : '')} onClick={() => setTab(2)}>项目配置</div>
        </div>
        <div className="content">
          {tab === 0 && <GlobalConfig />}
          {tab === 1 && <GeneratorConfig />}
          {tab === 2 && <ProjectConfig />}
        </div>
      </div>
      <div className="footer"></div>
   
    </div>
  )
}

export default IndexOptions
