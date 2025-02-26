import { useEffect, useState } from "react"
import Button from "~components/Button"
import Card from "~components/Card"
import FormItem from "~components/Form/Item"
import Textarea from "~components/Form/libs/Textarea"
import Space from "~components/Space"
import { getStorageConfig, setDefaultStorageConfig } from "~storage/app"
import { generatorStorageSet } from "~storage/generator"
import { globalConfigStorageSet } from "~storage/global"
import { projectStorageSet } from "~storage/project"
import analytics from "~utils/analytics"

const ErrorWarning = () => {
    const [globalConfig, setGlobalConfig] = useState<any>('')
    const [projectConfig, setProjectConfig] = useState<any>('')
    const [generateConfig, setGenerateConfig] = useState<any>('')


    useEffect(() => {
      analytics.firePageViewEvent('Error Warning Page')
        getStorageConfig().then((config) => {
            setGlobalConfig(config['swagger-fields-generator-global'])
            setProjectConfig(config['swagger-fields-generator-project'])
            setGenerateConfig(config['swagger-fields-generator-generate'])
        })
    }, [])
    const handleRestore = () => {
        analytics.fireEvent('click', {page: 'Error Warning',type: 'restore'})
        setDefaultStorageConfig().then(() => {
          alert('ok')
          getStorageConfig().then((config) => {
            setGlobalConfig(config['swagger-fields-generator-global'])
            setProjectConfig(config['swagger-fields-generator-project'])
            setGenerateConfig(config['swagger-fields-generator-generate'])
          })
        })
    }
    const handleFix = () => {
      analytics.fireEvent('click', {page: 'Error Warning',type: 'fix'})
      try {
        const globalConfigValue = JSON.parse(globalConfig)
        const projectConfigValue = JSON.parse(projectConfig)
        const generateConfigValue = JSON.parse(generateConfig)
        globalConfigStorageSet(globalConfigValue)
        projectStorageSet(projectConfigValue)
        generatorStorageSet(generateConfigValue)
      } catch (error) {
        alert(JSON.stringify(error))
      }
    }
    const renderTitle = () => {
        return <Space align="baseline">
            <span>{chrome.i18n.getMessage('config_error')}</span>
            <span style={{fontSize:12, fontWeight: 400, color: '#999'}}>{chrome.i18n.getMessage('please_fix_restore')}</span>
        </Space>
    }
    return <div>
        <Card title={renderTitle()}>
            <FormItem label={chrome.i18n.getMessage('global_page')}>
                <Textarea value={globalConfig} onChange={setGlobalConfig} />
            </FormItem>
            <FormItem label={chrome.i18n.getMessage('generate_page')}>
                <Textarea value={generateConfig} onChange={setGenerateConfig} />
            </FormItem>
            <FormItem label={chrome.i18n.getMessage('project_page')}>
                <Textarea value={projectConfig} onChange={setProjectConfig} />
            </FormItem>

            <Space style={{marginTop: 30,paddingLeft: 80}}>
                <Button type="ghost" onClick={handleRestore}>{chrome.i18n.getMessage('restore_config')}</Button>
                <Button onClick={handleFix}>{chrome.i18n.getMessage('save')}</Button>
            </Space>
        </Card>
    </div>
}
export default ErrorWarning
