import { forwardRef, useImperativeHandle, useRef, useState } from "react"
import Button from "~components/Button"
import Flex from "~components/Flex"
import FormItem from "~components/Form/Item"
import Input from "~components/Form/libs/Input"
import Textarea from "~components/Form/libs/Textarea"
import Modal from "~components/Modal"
import Space from "~components/Space"
import { generatorStorageGet, type GenerateConfigProps } from "~storage/generator"
import type { ProjectConfigProps } from "~storage/project"
import { stringSplit } from "~utils"

const ProjectConfigEdit = forwardRef((props: any, ref) => {
    const [visible, setVisible] = useState(false)
    const [data, setData] = useState<ProjectConfigProps>({})
    const handleResolve: any = useRef();
    const handleChange = (key: keyof ProjectConfigProps, value: any) => {
        setData({ ...data,[key]: value})
    }
     
    const open = (data?: ProjectConfigProps) => {
        const defaultData = {
            pathSelector: '.opblock-summary-path'
        }
        setVisible(true)

        setData(data || defaultData)
        
        return new Promise<void>((resolve, reject) => {
            handleResolve.current = resolve
        })
    }
    useImperativeHandle(ref, () => ({
        open
    }))
    const handleSubmit = () => {
        setVisible(false)
        handleResolve.current && handleResolve.current(data)
    }
    const handleCancel = () => {
        setVisible(false)
        setData({})
    }
    const renderFooter = () => {
        return (
            <Flex>
                <Button type="ghost" onClick={handleCancel}>取消</Button>
                <div style={{width: 10}} />
                <Button onClick={handleSubmit}>保存</Button>
            </Flex>
        )
    }
    const actionBtns = (btn) => {
        const list = stringSplit(data.btns).filter(e => e !== '')
        if (list.includes(btn)) {
            return list.filter(item => item !== btn).join(',')
        }
        return [...list, btn].join(',')
    }
    return (

        <Modal title="编辑" open={visible} footer={renderFooter()}>
            <FormItem width={100} label="URL">
              <Input value={data.url} onChange={(e) => handleChange('url', e)}  />
            </FormItem>
          
            <FormItem width={100} label="json src">
              <Textarea value={data.json} onChange={e => handleChange('json', e)} />
            </FormItem>
            <FormItem width={100} label="path selector">
              <Input value={data.pathSelector} onChange={(e) => handleChange('pathSelector', e)}  />
            </FormItem>
            <FormItem width={100} label="按钮">
                <Space>
                    {props.generate.map(item => (
                        stringSplit(data.btns).includes(item.uuid) ?
                        <Button size="small" type="ghost" key={item.uuid} onClick={() => handleChange('btns', actionBtns(item.uuid))}>{item.btnName}</Button>:
                        <Button size="small" type="ghost" style={{opacity: 0.5}} key={item.uuid} onClick={() => handleChange('btns', actionBtns(item.uuid))}>{item.btnName}</Button>
                    ))}
                </Space>
            </FormItem>
          
        </Modal>
    )
})

export default ProjectConfigEdit