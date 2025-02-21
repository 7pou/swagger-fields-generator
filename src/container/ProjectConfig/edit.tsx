import { forwardRef, useImperativeHandle, useMemo, useRef, useState } from "react"
import Button from "~components/Button"
import Flex from "~components/Flex"
import FormItem from "~components/Form/Item"
import Input from "~components/Form/libs/Input"
import Textarea from "~components/Form/libs/Textarea"
import Modal from "~components/Modal"
import Space from "~components/Space"
import type { ProjectConfigProps } from "~storage/project"
import { deepClone, stringSplit } from "~utils"

const ProjectConfigEdit = forwardRef((props: any, ref) => {
    const [visible, setVisible] = useState(false)
    const [data, setData] = useState<ProjectConfigProps>({})
    const handleResolve: any = useRef();
    const dragRef: any = useRef()
    const handleChange = (key: keyof ProjectConfigProps, value: any) => {
        setData({ ...data,[key]: value})
    }

    const open = (data?: ProjectConfigProps) => {
        const defaultData = {
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
                <Button type="ghost" onClick={handleCancel}>{chrome.i18n.getMessage('cancel')}</Button>
                <div style={{width: 10}} />
                <Button onClick={handleSubmit}>{chrome.i18n.getMessage('save')}</Button>
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
    const handleDragStart = (e,uuid) => {
      dragRef.current = {
        target: e.target,
        uuid
      }
    }
    const handleDragEnter = (e, uuid) => {
        if (dragRef.current.target === e.target) return
        if (!stringSplit(data.btns).includes(uuid)) return
        setData(data => {
          const dragIndex = stringSplit(data.btns).findIndex(item => item == dragRef.current.uuid)
          const dropIndex = stringSplit(data.btns).findIndex(item => item == uuid)
          const btns = [...stringSplit(data.btns)]
          btns.splice(dragIndex, 1)
          btns.splice(dropIndex, 0, dragRef.current.uuid)
          return {...data, btns: btns.join(',')}
        })

    }
    const viewerList = useMemo(() => {
      const generates = deepClone(props.generate)
      const result = []
       stringSplit(data.btns).forEach(item => {
        const index = generates.findIndex(e => e.uuid === item)
        if ( index === -1) return
        result.push(generates.splice(index, 1)[0])
      })
      result.push(...generates)
      return result
    },[data.btns, props.generate])
    return (

        <Modal title={chrome.i18n.getMessage(data.uuid ? 'edit': 'create')} open={visible} footer={renderFooter()}>
            <FormItem width={100} label="URL">
              <Input value={data.url} onChange={(e) => handleChange('url', e)}  />
            </FormItem>

            <FormItem width={100} label="json src">
              <Textarea value={data.json} onChange={e => handleChange('json', e)} />
            </FormItem>
            <FormItem width={100} label={chrome.i18n.getMessage('button_name')}>
                <Space>
                    {viewerList?.map(item => (
                        stringSplit(data.btns).includes(item.uuid) ?
                        <Button
                          draggable
                          onDragStart={(e) => handleDragStart(e, item.uuid)}
                          onDragEnter={(e) => handleDragEnter(e, item.uuid)}
                          onDragOver={e => e.preventDefault()}
                          size="small"
                          type="ghost"
                          key={item.uuid}
                          onClick={() => handleChange('btns', actionBtns(item.uuid))}
                        >{item.btnName}</Button>:
                        <Button size="small" type="ghost" style={{opacity: 0.5}} key={item.uuid} onClick={() => handleChange('btns', actionBtns(item.uuid))}>{item.btnName}</Button>
                    ))}
                </Space>
            </FormItem>

        </Modal>
    )
})

export default ProjectConfigEdit
