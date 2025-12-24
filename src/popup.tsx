import { useEffect, useState } from "react"
import "~utils/eventBus"
import './styles/popup.scss'
import { projectStorageGetByHost, projectStorageInsert, projectStorageUpdate, type ProjectConfigProps } from "~storage/project"
import Switch from "~components/Form/libs/Switch"
import Flex from "~components/Flex"
import View from "~components/View"
import { globalConfigStorageGet } from "~storage/global"
import { generatorStorageGet } from "~storage/generator"
import { requestSource } from "~utils/requestSource"
import { getCurrentUrlByChromeTabs, insertOpblockBtns, openOptionsPage } from "~core"
import analytics from "~utils/analytics"
import SwaggerParser from '@apidevtools/swagger-parser'

function IndexPopup() {
  const [project, setProject] = useState<ProjectConfigProps | null>(null)
  const [switchLoading, setSwitchLoading] = useState(false)



  useEffect(() => {
    analytics.firePageViewEvent('Popup Page')
    postProject().then((projectData) => {
      setProject(projectData)
    })
  }, [])

  const postProject = async () => {
    const url = await getCurrentUrlByChromeTabs().catch()
    if (!url) return
    const projectData = await projectStorageGetByHost(url.origin).catch()
    if (!projectData) return
    return projectData
  }

  const handleNavOption = () => {
    analytics.fireEvent('click', {page: 'popup',type: 'nav option'})
    openOptionsPage();
  }
  const handleOpen = async () => {
    analytics.fireEvent('click', {page: 'popup',type: 'switch'})

    if (project?.enable === true) {
      const projectConfig = { ...project, enable: false, loadJsonSuccess: null }
      await projectStorageUpdate(projectConfig)
      setProject(projectConfig)
      return
    }

    const config = await globalConfigStorageGet()
    const generate = await generatorStorageGet()
    const url = await getCurrentUrlByChromeTabs()

    setSwitchLoading(true)
    const rawData = await requestSource(url.origin).finally(() => {
      setSwitchLoading(false)
    })
    let dereferencedData = null
    if (rawData) {
      dereferencedData = await SwaggerParser.dereference(rawData)
    }
    // 如果没有项目 则创建, 有的话只改变状态
    if (!project) {
      const projectConfig: ProjectConfigProps = {
        btns: generate.map(item => item.uuid).join(','),
        url: url.origin,
        json: config.json,
        loadJsonSuccess: !!rawData
      }
      await projectStorageInsert(projectConfig)
      setProject(projectConfig)
    } else {
      const projectConfig = { ...project, enable: true, loadJsonSuccess: !!rawData }
      await projectStorageUpdate(projectConfig)
      setProject(projectConfig)
    }

    // 重新获取项目信息
    const projectd = await postProject()

    dereferencedData && await insertOpblockBtns(projectd, dereferencedData)

  }
  const  handleNavFeedback = () => {
    analytics.fireEvent('click', {page: 'popup',type: 'nav feedback'})
    window.open('https://github.com/7pou/swagger-fields-generator/issues')
  }

  const handleNavHelp = () => {
    analytics.fireEvent('click', {page: 'popup',type: 'nav help'})
    openOptionsPage({tab: 'help'})
  }
  const handleNavProjectOption = () => {
    analytics.fireEvent('click', {page: 'popup',type: 'nav project option'})
    openOptionsPage({tab: 'project', id: project.uuid})
  }

  return (
    <div className="swagger-fields-generator-popup">
      <Flex  className="header" align="center" justify="space-between">
        <div className="icon">🧙🏻</div>
        <Switch size="small" value={!!project?.enable} onChange={handleOpen} loading={switchLoading} />
      </Flex>
      <View if={!!project?.enable}>
        <View if={project?.loadJsonSuccess === true} className="error-message" >
          <span>successful!🍻🍻🍻</span>
        </View>
        <View if={project?.loadJsonSuccess === false} className="error-message" >
          <span>{chrome.i18n.getMessage('load_json_error')}</span>
          <span className="link" onClick={handleNavProjectOption}>GO&gt;</span>
        </View>
      </View>
      <div className="menu-item" onClick={handleNavOption}>{chrome.i18n.getMessage('options_page')}</div>
      <div className="menu-item" onClick={handleNavFeedback}>{chrome.i18n.getMessage('feedback')}</div>
      <div className="menu-item" onClick={handleNavHelp}>{chrome.i18n.getMessage('help')}</div>
    </div>
  )
}

export default IndexPopup
