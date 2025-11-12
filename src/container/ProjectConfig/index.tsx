

import { useEffect, useRef, useState } from "react";
import Button from "~components/Button";
import Card from "~components/Card";
import Flex from "~components/Flex";
import Switch from "~components/Form/libs/Switch";
import Table from "~components/Table";
import { projectStorageGet, projectStorageInsert, projectStorageSet, projectStorageUpdate } from "~storage/project";
import ProjectConfigEdit from "./edit";
import { stringSplit, uuid } from "~utils";
import Space from "~components/Space";
import { generatorStorageGet, type GenerateConfigProps } from "~storage/generator";
import analytics from "~utils/analytics";

const ProjectConfig = () => {
  const [data, setData] = useState([])
  const [generate, setGenerate] = useState<GenerateConfigProps[]>([])

  const ProjectConfigEditRef: any = useRef()

    useEffect(() => {
      analytics.firePageViewEvent('ProjectConfig List Page')
      projectStorageGet().then((res) => {
          setData(res || [])
      })
      generatorStorageGet().then(res => {
          setGenerate(res)
      })
    }, [])
    const handleEdit = (index) => {
      const current = data[index]
        ProjectConfigEditRef.current?.open(current).then(res => {
          res.loadJsonSuccess = false
          return projectStorageUpdate(res)
        }).then(() => {
          analytics.fireEvent('click', {page: 'ProjectConfig List',type: 'edit'})
          projectStorageGet().then((res) => {
              setData(res || [])
          })
        })

    }
    const hanldeAdd = () => {
      ProjectConfigEditRef.current?.open().then(res => {
        return projectStorageInsert(res)
      }).then(() => {
        analytics.fireEvent('click', {page: 'ProjectConfig List',type: 'add'})
        projectStorageGet().then((res) => {
            setData(res || [])
        })
      })
    }
    const handleStatusChange = (text, index) => {
      projectStorageUpdate({ ...data[index], enable: !text }).then(() => {
        analytics.fireEvent('click', {page: 'ProjectConfig List',type: 'status-change'})
        projectStorageGet().then((res) => {
            setData(res || [])
        })
      })
    }
    const handleDelete = (index) => {
      const isDel = confirm(chrome.i18n.getMessage('are_you_sure_to_delete'))
      if (!isDel) return
      projectStorageSet([...data.slice(0, index), ...data.slice(index + 1)]).then(() => {
        analytics.fireEvent('click', {page: 'ProjectConfig List',type: 'delete'})
        projectStorageGet().then((res) => {
            setData(res || [])
        })
      })
    }
    const hanldeReference = () => {
        projectStorageGet().then((res) => {
            setData(res || [])
        })
    }
    const columns = [
        {
          title: "URL",
          dataIndex: "url",
        },
        {
          title: "JSON",
          dataIndex: "json",
        },
        {
          title: chrome.i18n.getMessage('button'),
          dataIndex: "btns",
          width: 200,
          render: (text) => {
            return <Space>{stringSplit(text)?.map((uuid) => {
              const name = generate.find(item => item.uuid === uuid)?.btnName
              return <Button type="ghost" size="small">{name}</Button>
            })}</Space>
          }
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
              <Button  type="link" onClick={() => handleDelete(index)}>{chrome.i18n.getMessage('delete')}</Button>
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
        <Card title={chrome.i18n.getMessage('project_page')} action={renderAction()}>
            <Table columns={columns} dataSource={data}></Table>
            <ProjectConfigEdit generate={generate} ref={ProjectConfigEditRef} />
        </Card>
    )
}
export default ProjectConfig;
