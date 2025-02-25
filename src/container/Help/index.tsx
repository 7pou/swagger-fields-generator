import { DISCORD_INVITE_URL, GITHUB_URL, T_INVITE_URL } from "~common/constant";
import Button from "~components/Button";
import Card from "~components/Card";
import Collapse from "~components/Collapse";
import Col from "~components/Grid/Col";
import Row from "~components/Grid/Row";
import Space from "~components/Space";
import Upload from "~components/Upload";
import { getStorageConfig, setDefaultStorageConfig } from "~storage/app";
import { generatorStorageSet } from "~storage/generator";
import { globalConfigStorageSet } from "~storage/global";
import { projectStorageSet } from "~storage/project";
import { downloadJson } from "~utils";
const Help = () => {
  const handleImport = (ev, reader) => {
    try {
      const json = reader.target.result;
      const result = JSON.parse(json)
      const generate = result['swagger-fields-generator-generate']
      const global = result['swagger-fields-generator-global']
      const project = result['swagger-fields-generator-project']
      const createTime = result.ext['create-time']
      const version = result.ext['version']
      const message = 'json createTime:' + createTime + ' ' + chrome.i18n.getMessage('are_you_sure_to_import_this_config')
      const isConfirm = confirm(message)
      if (!isConfirm) return

      projectStorageSet(JSON.parse(project))
      generatorStorageSet(JSON.parse(generate))
      globalConfigStorageSet(JSON.parse(global))
    } catch (error) {
      console.log(error)
    }

  }
  const handleExport = async () => {
    const json = await getStorageConfig()
    const ext = {
      'version': process.env.PLASMO_PUBLIC_VERSION,
      'create-time': new Date().toLocaleString()
    }
    downloadJson({...json, ext})
  }
  const handleRestore = () => {
    if(confirm(chrome.i18n.getMessage('are_you_sure_to_restore_default_config')) === false) return
    setDefaultStorageConfig().then(() => {
      alert('ok')
    })
  }
  const generateCode = `
function(data) {
  return data
}
  `
  const apiCode = `
{
  "path": "/user",
  "method": "post",
  "tags": "user",
  "summary": "Create user",
  "description": "This can only be done by the logged in user.",
  "operationId": "createUser",
  "consumes": [
    "application/json"
  ],
  "produces": [
    "application/json",
    "application/xml"
  ],
  "requestParams": null,
  "requestBody": {
    "type": "object",
    "properties": {
      "id": {
        "type": "integer",
        "format": "int64"
      },
      "username": {
        "type": "string"
      },
      "firstName": {
        "type": "string"
      },
      "lastName": {
        "type": "string"
      },
      "email": {
        "type": "string"
      },
      "password": {
        "type": "string"
      },
      "phone": {
        "type": "string"
      },
      "userStatus": {
        "type": "integer",
        "format": "int32",
        "description": "User Status"
      }
    },
    "xml": {
      "name": "User"
    }
  },
  "responsesData": null,
  "requestParamsType": null,
  "requestBodyType": "{ id: number;username: string;firstName: string;lastName: string;email: string;password: string;phone: string;userStatus: number; }",
  "responsesDataType": null
}
  `
  return <div className="help-container">
    <Collapse title={chrome.i18n.getMessage('quick_start')}>
      <div>
        <p>1. 打开你的swagger网站</p>
        <p>2. 打开插件popup, 点击打开状态开关</p>
        <p>3. 当打开后会自动根据全局配置的JSON请求地址尝试获取JSON数据</p>
        <p>4. 如果获取JSON数据成功, 插件会提示 successful 🍻, 刷新当前页面后即可看到插件本身带的两个按钮</p>
        <p>5. 点击按钮, 生成的代码会以弹窗的形式弹出</p>
        <p>6. 如果获取JSON数据失败, 需要点击去配置页给当前的swagger 配置JSON请求地址</p>
        <p>7. 配置完成后, 重复步骤2</p>

      </div>
    </Collapse>
    <Collapse title={chrome.i18n.getMessage('demo')}>
      <div>
        <p>
          <span>1. swagger网站</span>
          <a href="https://petstore.swagger.io" target="_blank">https://petstore.swagger.io</a>
        </p>
        <p>2. 点击任一api的 Antd Column按钮</p>
        <p>3. 在弹窗的窗口复制生成的代码</p>
      </div>
    </Collapse>
    <Collapse title={chrome.i18n.getMessage('global_page')}>
      <div>
        <h3>显示按钮数量</h3>
        <p>在swagger页面中api栏插入显示的最多按钮数量</p>
        <p>默认值是5, 当项目配置的按钮数量超出该值会以折叠的方式呈现</p>
        <p></p>
        <h3>JSON请求地址</h3>
        <p>当popup中开启新项目后, 会复制当前的JSON请求地址配置到项目中</p>
      </div>
    </Collapse>
    <Collapse title={chrome.i18n.getMessage('generate_page')}>
      <div>
        <h3>按钮名称</h3>
        <p>当前生成器在api后的按钮名字</p>
        <p></p>
        <h3>生成器代码</h3>
        <p>需要声明一个匿名函数, 该函数的作用是一个转换器, 并需要返回值, 插件调用该函数时会传入一个对象,并接收转换后的数据用于点击按钮后生成代码</p>

        <p>转换器格式如下</p>
        <pre><code>{generateCode}</code></pre>
        <p>此入data参格式如下</p>
        <pre><code>{apiCode}</code></pre>


        <p>提示: 可以先从编辑器中编辑完成, 调试没有错误再粘贴进来</p>
      </div>
    </Collapse>
    <Collapse title={chrome.i18n.getMessage('project_page')}>
      <div>
        <h3>URL</h3>
        <p>需要开启插件的页面地址, 支持星号匹配 </p>
        <p>例如: 配置为 https://xxx.com/v1, 则https://xxx.com/v1/xxx会匹配成功, https://xxx.com/v2/xxx会匹配失败</p>
        <p>例如: 配置的为 *, 则所有地址都会匹配成功</p>
        <p>例如: 配置的为 https://xxx/api/v1/*, 则所有以/https://xxx/api/v1/开头的地址都会匹配成功</p>

        <p></p>
        <h3>json地址配置</h3>
        <p>当前swagger的schema的json地址, 例如https://petstore.swagger.io的https://petstore.swagger.io/v2/swagger.json</p>
        <p>支持添加多个, 以回车区分</p>
        <p>支持全路径和绝对路径</p>

        <h3>选择显示按钮</h3>
        <p>选择当前swagger页面中需要显示的按钮</p>
        <p>支持拖拽排序</p>
      </div>

    </Collapse>
    <Card>
      <Row>
        <Col width={260}>
          <div className="title">🧙 swagger-fields-generoator</div>
          <div className="slogan">{chrome.i18n.getMessage('slogan')}</div>
          <div className="connect">
            <a href={T_INVITE_URL} target="_blank" className="link">
              <i className="iconfont icon-telegram"/>
            </a>
            <a href={DISCORD_INVITE_URL} target="_dlank" className="link">
              <i className="iconfont icon-discord"/>
            </a>
            <a href={GITHUB_URL} target="_dlank" className="link">
              <i className="iconfont icon-github"/>
            </a>
            <span  className="link fixed">
              <i className="iconfont icon-weixin"/>
              <img className="wechat" src="https://raw.githubusercontent.com/7pou/swagger-fields-generator/refs/heads/master/assets/wechat.jpg" alt="" />
            </span>
          </div>

          <img className="ferrari" src="https://raw.githubusercontent.com/7pou/swagger-fields-generator/refs/heads/master/assets/Ferrari.jpg" alt="" />
        </Col>
        <Col width={40} />
        <Col width={500} >
          <div style={{marginTop: 0, fontSize: 16}}>🏂 配置操作</div>
          <div style={{color: '#999'}}>
            <p>配置可以按JSON的格式导出本地, 也可以从本地导入配置到插件中</p>
            <p>当配置出现异常后, 可以导出配置文件, 在编辑器中修改后再导入到插件</p>
            <p>或者点击恢复默认配置, 请注意: 此操作会永久丢失配置, 请注意导出备份</p>
          </div>
          <Space style={{marginTop: 20}}>
            <Button onClick={handleExport}>{chrome.i18n.getMessage('export_config')}</Button>
            <Upload onChange={handleImport} accept=".json">
              <Button>{chrome.i18n.getMessage('import_config')}</Button>
            </Upload>
            <Button onClick={handleRestore}>{chrome.i18n.getMessage('restore_config')}</Button>
          </Space>

        </Col>
      </Row>
    </Card>
  </div>
}
export default Help;
