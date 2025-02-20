import { useEffect, useState } from "react"
import './styles/popup.scss'
import { projectStorageGetByHost, projectStorageInsert, projectStorageUpdate, type ProjectConfigProps } from "~storage/project"
import Switch from "~components/Form/libs/Switch"
import Flex from "~components/Flex"
import View from "~components/View"
import { globalConfigStorageGet } from "~storage/global"
import { generatorStorageGet } from "~storage/generator"
import { requestSource } from "~utils/requestSource"
import { getCurrentUrlByChromeTabs, insertOpblockBtns } from "~core"
 
 
function IndexPopup() {
  const [project, setProject] = useState<ProjectConfigProps | null>(null)


  
  useEffect(() => {
    postProject().then((projectData) => {
      setProject(projectData)
    })
  }, [])

  const postProject = async () => {
    const url = await getCurrentUrlByChromeTabs().catch()
    if (!url) return
    const projectData = await projectStorageGetByHost(url).catch()
    if (!projectData) return
    return projectData
  }

  const handleNavOption = () => {
    chrome.runtime.openOptionsPage();
  }
  const handleOpen = async () => {

    const config = await globalConfigStorageGet()
    const generate = await generatorStorageGet()
    const url = await getCurrentUrlByChromeTabs()
    const data = await requestSource(url)
    // 如果没有项目 则创建, 有的话只改变状态
    if (!project) {
      const projectConfig: ProjectConfigProps = {
        btns: generate.map(item => item.uuid).join(','),
        url: url,
        json: config.json,
        loadJsonSuccess: !!data
      }
      await projectStorageInsert(projectConfig)
    } else if (project?.enable === true) {
      await projectStorageUpdate({...project, enable: false, loadJsonSuccess: null})
    } else {
      await projectStorageUpdate({...project, enable: true, loadJsonSuccess: !!data})
    }

    // 重新获取项目信息并更新到state中, 如果当前项目为开启的话 则创建按钮
    const projectd = await postProject()

    if (projectd) {
      setProject(projectd)
      if (projectd?.enable === true) {
        await insertOpblockBtns(projectd, data)
      }
    }
    
  }
  const  handleNavFeedback = () => {
    window.open('https://github.com/7pou/swagger-fields-generator/issues')
  }
  
  return (
    <div className="swagger-fields-generator-popup">
      <Flex  className="header" align="center" justify="space-between">
        <div className="icon">🧙🏻</div>
        <Switch size="small" value={!!project?.enable} onChange={handleOpen} />
      </Flex>
      <View if={!!project?.enable}>
        <View if={project?.loadJsonSuccess === true} className="error-message" >
          <span>successful!🍻🍻🍻</span>
        </View>
        <View if={project?.loadJsonSuccess === false} className="error-message" >
          <span>获取失败,请手动配置JSON地址</span>
          <span className="link" onClick={handleNavOption}>GO&gt;</span>
        </View>
      </View>
      <div className="menu-item" onClick={handleNavOption}>配置页</div>
      <div className="menu-item" onClick={handleNavFeedback}>反馈</div>
    </div>
  )
}

export default IndexPopup
