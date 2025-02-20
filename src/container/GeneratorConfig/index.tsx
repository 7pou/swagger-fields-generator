import { useEffect, useRef, useState } from "react";
import Button from "~components/Button";
import Card from "~components/Card";
import Flex from "~components/Flex";
import Switch from "~components/Form/libs/Switch";
import Table from "~components/Table";
import { generatorStorageGet, generatorStorageSet } from "~storage/generator";
import GeneratorConfigEdit from "./edit";
import { uuid } from "~utils";
import Space from "~components/Space";

const GeneratorConfig = () => {
  const [data, setData] = useState([])
  const GeneratorConfigEditRef: any = useRef()
    useEffect(() => {
        generatorStorageGet().then((res) => {
            setData(res || [])
        })
    }, [])
    const handleEdit = (index) => {
      const current = data[index]
        GeneratorConfigEditRef.current?.open(current).then(res => {
            res.updateTime = new Date().toLocaleString()
            return generatorStorageSet([...data.slice(0, index), res, ...data.slice(index + 1)])
        }).then(() => {
            generatorStorageGet().then((res) => {
                setData(res || [])
            })
        })

    }
    const hanldeAdd = () => {
      GeneratorConfigEditRef.current?.open().then(res => {
        res.enable = true
        res.uuid = uuid()
        res.createTime = new Date().toLocaleString()
        return generatorStorageSet([...data, res])
      }).then(() => {
        generatorStorageGet().then((res) => {
            setData(res || [])
        })
      })
    }
    const handleStatusChange = (text, index) => {
      generatorStorageSet([...data.slice(0, index), { ...data[index], enable: !text }, ...data.slice(index + 1)]).then(() => {
        generatorStorageGet().then((res) => {
            setData(res || [])
        })
      })
    }
    const handleDelete = (index) => {
      const isDel = confirm(chrome.i18n.getMessage('are_you_sure_to_delete'))
      if (!isDel) return
      generatorStorageSet([...data.slice(0, index), ...data.slice(index + 1)]).then(() => {
        generatorStorageGet().then((res) => {
            setData(res || [])
        })
      })
    }
    const hanldeReference = () => {
        generatorStorageGet().then((res) => {
            setData(res || [])
        })
    }
    const columns = [
        {
          title: chrome.i18n.getMessage('button_name'),
          dataIndex: "btnName",
        },
        {
          title: chrome.i18n.getMessage('status'),
          dataIndex: "enable",
          width: 34,
          render: (text,record, index) => <Switch size="small" value={text} onChange={(() => handleStatusChange(text, index))} />
        },
        {
          title: chrome.i18n.getMessage('action'),
          dataIndex: "action",
          width: 80,

          render: (text, record, index) => (
            <Flex>
              <Button type="link" onClick={() => handleEdit(index)}>{chrome.i18n.getMessage('edit')}</Button>
              <div style={{width:4}}></div>
              <Button type="link" onClick={() => handleDelete(index)}>{chrome.i18n.getMessage('delete')}</Button>
            </Flex> 
          )
        }
    ]
    const renderAction = () => {
      return <Space>
        <Button type="link" onClick={hanldeReference}>
          <i className="iconfont icon-reference"/>
        </Button>
        <Button onClick={hanldeAdd}>{chrome.i18n.getMessage('create')}</Button>
      </Space>
    }
   
    return (
        <Card title={chrome.i18n.getMessage('generate_page')} action={renderAction()}>
            <Table columns={columns} dataSource={data}></Table>
            <GeneratorConfigEdit ref={GeneratorConfigEditRef} />
        </Card>
    )
}
export default GeneratorConfig;