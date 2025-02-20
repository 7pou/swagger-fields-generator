import { useEffect, useState } from "react"
import Button from "~components/Button"
import Card from "~components/Card"
import FormItem from "~components/Form/Item"
import Input from "~components/Form/libs/Input"
import Select from "~components/Form/libs/Select"
import Switch from "~components/Form/libs/Switch"
import Textarea from "~components/Form/libs/Textarea"
import Col from "~components/Grid/Col"
import Row from "~components/Grid/Row"
import { globalConfigStorageGet, globalConfigStorageSet, type GlobalConfigProps } from "~storage/global"


const GlobalConfig = () => {
    const [data, setData] = useState<GlobalConfigProps>({})
    useEffect(() => {
        globalConfigStorageGet().then(res => {
            setData(res)
        })
    },[])
    const language = [
        {label: "简体中文",value: "zh-CN"},
        {label: "English",value: "en-US"},
    ]
    const handleSubmit = () => {
        data.updateTime = new Date().toLocaleString()
        globalConfigStorageSet(data).then(res => {
          alert('保存成功')
        })
    }
    const handleChange = (key: keyof GlobalConfigProps, value: any) => {
        setData({ ...data,[key]: value})
    }
    return (
        <Card title="全局配置" action={<Switch value={data.enable} onChange={() => handleChange('enable', !data.enable)} /> }>
        <Row>
          <Col span={10} >
            <FormItem width={100} label="显示按钮数量">
              <Input value={data.maxBtn} onChange={(e) => handleChange('maxBtn', e)}  />
            </FormItem>
            <FormItem width={100} label="语言">
              <Select options={language} value={data.language} onChange={e => handleChange('language', e)} />
            </FormItem>
            <FormItem width={100} label="JSON地址">
              <Textarea value={data.json} onChange={e => handleChange('json', e)} />
            </FormItem>
            <FormItem width={100} label="上次修改时间">
              <div style={{marginTop: 8, color: '#999'}}>{data.updateTime}</div>
            </FormItem>
            <Button onClick={handleSubmit}>保存</Button>
          </Col>
        </Row>
      </Card>
    )
}
export default GlobalConfig