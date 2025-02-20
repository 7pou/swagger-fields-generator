import { forwardRef, useImperativeHandle, useRef, useState } from "react"
import Button from "~components/Button"
import Flex from "~components/Flex"
import FormItem from "~components/Form/Item"
import Input from "~components/Form/libs/Input"
import Textarea from "~components/Form/libs/Textarea"
import Modal from "~components/Modal"
import type { GenerateConfigProps } from "~storage/generator"

const GeneratorConfigEdit = forwardRef((props, ref) => {
    const [visible, setVisible] = useState(false)
    const [data, setData] = useState<GenerateConfigProps>({})
    const handleResolve: any = useRef();
     const handleChange = (key: keyof GenerateConfigProps, value: any) => {
        setData({ ...data,[key]: value})
    }
    const open = (data?: GenerateConfigProps) => {
        setVisible(true)
        setData(data || {})
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
        return <Flex>
            <Button type="ghost" onClick={handleCancel}>{chrome.i18n.getMessage('cancel')}</Button>
            <div style={{width: 10}} />
            <Button onClick={handleSubmit}>{chrome.i18n.getMessage('save')}</Button>
        </Flex>
    }
    return (

        <Modal title={chrome.i18n.getMessage(data.uuid? 'edit': 'create')} open={visible} footer={renderFooter()}>
            <FormItem width={100} label={chrome.i18n.getMessage('button_name')}>
              <Input value={data.btnName} onChange={(e) => handleChange('btnName', e)}  />
            </FormItem>
          
            <FormItem width={100} label={chrome.i18n.getMessage('generate_code')}>
              <Textarea value={data.code} onChange={e => handleChange('code', e)} />
            </FormItem>
        </Modal>
    )
})

export default GeneratorConfigEdit