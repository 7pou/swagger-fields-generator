import { forwardRef, useImperativeHandle, useRef, useState } from "react"
import Button from "~components/Button"
import Flex from "~components/Flex"
import FormItem from "~components/Form/Item"
import CodeEditor from "~components/Form/libs/CodeEditor"
import Input from "~components/Form/libs/Input"
import Modal from "~components/Modal"
import type { GenerateConfigProps } from "~storage/generator"
import analytics from "~utils/analytics"

const GeneratorConfigEdit = forwardRef((props, ref) => {
    const [visible, setVisible] = useState(false)
    const [data, setData] = useState<GenerateConfigProps>({})
    const handleResolve: any = useRef(null);
     const handleChange = (key: keyof GenerateConfigProps, value: any) => {
      setData({ ...data,[key]: value})
    }
    const open = (data?: GenerateConfigProps) => {
        setVisible(true)
        setData(data || {})
        analytics.firePageViewEvent('Generator Edit Page')
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

        <Modal title={chrome.i18n.getMessage(data.uuid? 'edit': 'create')} width={800} open={visible} footer={renderFooter()}>
            <FormItem direction="column" width={100} label={chrome.i18n.getMessage('button_name')}>
              <Input value={data.btnName} onChange={(e) => handleChange('btnName', e)}  />
            </FormItem>

            <FormItem direction="column" width={100} label={chrome.i18n.getMessage('generate_code')}>
              <CodeEditor
                value={data.code || ''}
                onChange={(v) => handleChange('code', v)}
              />
            </FormItem>
        </Modal>
    )
})

export default GeneratorConfigEdit
