

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

const ProjectConfig = () => {
  const [data, setData] = useState([])
  const [generate, setGenerate] = useState<GenerateConfigProps[]>([])
 
  const ProjectConfigEditRef: any = useRef()

    useEffect(() => {
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
            projectStorageGet().then((res) => {
                setData(res || [])
            })
        })

    }
    const hanldeAdd = () => {
      ProjectConfigEditRef.current?.open().then(res => {
        return projectStorageInsert(res)
      }).then(() => {
        projectStorageGet().then((res) => {
            setData(res || [])
        })
      })
    }
    const handleStatusChange = (text, index) => {
      projectStorageUpdate({ ...data[index], enable: !text }).then(() => {
        projectStorageGet().then((res) => {
            setData(res || [])
        })
      })
    }
    const handleDelete = (index) => {
      const isDel = confirm("确定删除？")
      if (!isDel) return
      projectStorageSet([...data.slice(0, index), ...data.slice(index + 1)]).then(() => {
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
          title: "按钮",
          dataIndex: "btns",
          width: 200,
          render: (text) => {
            return <Space>{stringSplit(text).map((uuid) => {
              const name = generate.find(item => item.uuid === uuid)?.btnName
              return <Button type="ghost" size="small">{name}</Button>
            })}</Space>
          }
        },
        {
          title: "状态",
          dataIndex: "enable",
          width: 34,
          render: (text,record, index) => <Switch size="small" value={text} onChange={(() => handleStatusChange(text, index))} />
        },
        {
          title: "操作",
          dataIndex: "action",
          width: 80,
          render: (text, record, index) => (
            <Flex>
              <Button type="link" onClick={() => handleEdit(index)}>编辑</Button>
              <div style={{width:4}}></div>
              <Button type="link" onClick={() => handleDelete(index)}>删除</Button>
            </Flex> 
          )
        }
    ]
    const renderAction = () => {
      return <Space>
        <Button type="link" onClick={hanldeReference}>刷新</Button>
        <Button onClick={hanldeAdd}>新增</Button>
      </Space>
    }
    return (
        <Card title="生成配置" action={renderAction()}>
            <Table columns={columns} dataSource={data}></Table>
            <ProjectConfigEdit generate={generate} ref={ProjectConfigEditRef} />
        </Card>
    )
}
export default ProjectConfig;