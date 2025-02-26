import { useEffect } from "react";
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
import analytics from "~utils/analytics";
const Help = () => {
  useEffect(() => {
    analytics.firePageViewEvent('Help Page')
  },[])
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
      analytics.fireEvent('click', {page: 'Help',type: 'import', status: 'success'})
    } catch (error) {
      console.log(error)
      analytics.fireEvent('click', {page: 'Help',type: 'import', status: 'error', error: error.message})
    }

  }
  const handleExport = async () => {
    const json = await getStorageConfig()
    const ext = {
      'version': process.env.PLASMO_PUBLIC_VERSION,
      'create-time': new Date().toLocaleString()
    }
    analytics.fireEvent('click', {page: 'Help',type: 'export', status: 'success'})
    downloadJson({...json, ext})
  }
  const handleRestore = () => {
    if(confirm(chrome.i18n.getMessage('are_you_sure_to_restore_default_config')) === false) return
    setDefaultStorageConfig().then(() => {
      analytics.fireEvent('click', {page: 'Help',type: 'restore', status: 'success'})
      alert('ok')
    })
  }
  const handleCollapseToggle = (name, status) => {
    if (status) {
      analytics.fireEvent('click', {page: 'Help',type: '查看帮助', name: name})
    }
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
  "requestParams": [
    {
      "name": "username",
      "in": "query",
      "description": "The user name for login",
      "required": true,
      "type": "string"
    },
    {
      "name": "password",
      "in": "query",
      "description": "The password for login in clear text",
      "required": true,
      "type": "string"
    }
  ],
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
    "responsesData": {
    "type": "object",
    "properties": {
      "code": {
        "type": "integer",
        "format": "int32"
      },
      "data": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "id": {
              "type": "integer",
              "format": "int64",
              "description": "id"
            },
            "name": {
              "type": "string",
              "description": "名称"
            }
          },
          "title": "DropDownVo"
        }
      },
      "message": {
        "type": "string"
      },
      "systemDate": {
        "type": "string"
      }
    },
    "title": "BaseRes«List«DropDownVo»»"
  },
  "requestParamsType": null,
  "requestBodyType": "{ id: number;username: string;firstName: string;lastName: string;email: string;password: string;phone: string;userStatus: number; }",
  "responsesDataType": "{ code: number;data: Array<{ id: number;name: string; }>;message: string;systemDate: string; }"
}
  `
  return <div className="help-container">
    <Collapse title={chrome.i18n.getMessage('quick_start')} onToggle={e => handleCollapseToggle('快速开始', e)}>
    {chrome.i18n.getMessage('i18n') === '中文' ?
      <div>
        <p>1. 打开目标swagger网站</p>
        <p>2. 打开插件popup, 点击启用状态开关</p>
        <p>3. 当启用后会自动根据全局配置的JSON请求地址尝试获取JSON数据</p>
        <p>4. 如果获取JSON数据成功, 插件会提示 successful 🍻, 刷新当前页面后, 您将看到插件本身带的两个生成器按钮</p>
        <p>5. 点击按钮, 生成的代码会以弹窗的形式弹出</p>
        <p>6. 如果获取JSON数据失败, 请点击去配置页, 为当前的swagger 配置JSON请求地址</p>
        <p>7. 配置完成后, 重复步骤2</p>
      </div>
      :
      <div>
        <p>1. Open the target Swagger website.</p>
        <p>2. Open the plugin popup and click the enable toggle.</p>
        <p>3. Once enabled, the plugin will automatically attempt to fetch JSON data based on the globally configured JSON request URL.</p>
        <p>4. If the JSON data is successfully retrieved, the plugin will display a "successful 🍻" message. Refresh the current page, and you will see the two generator buttons added by the plugin.</p>
        <p>5. Click the buttons, and the generated code will appear in a popup.</p>
        <p>6. If fetching the JSON data fails, please go to the configuration page and set the JSON request URL for the current Swagger.</p>
        <p>7. After configuring, repeat step 2.</p>
    </div>
    }
    </Collapse>
    <Collapse title={chrome.i18n.getMessage('demo')} onToggle={e => handleCollapseToggle('demo', e)}>
      {
        chrome.i18n.getMessage('i18n') === '中文' ?
        <div>
          <p>
            <span>1. 打开swagger网站</span>
            <a href="https://petstore.swagger.io" target="_blank">https://petstore.swagger.io</a>
          </p>
          <p>2. 点击任一api的 Antd Column按钮</p>
          <p>3. 在弹窗的窗口复制生成的代码</p>
        </div>
        :
        <div>
          <p>
            <span>1. Open the Swagger website</span>
            <a href="https://petstore.swagger.io" target="_blank">https://petstore.swagger.io</a>
          </p>
          <p>2. Click the "Antd Column" button of any API</p>
          <p>3. Copy the generated code from the popup window</p>
        </div>
      }
    </Collapse>
    <Collapse title={chrome.i18n.getMessage('global_page')} onToggle={e => handleCollapseToggle('全局配置', e)}>
      {chrome.i18n.getMessage('i18n') === '中文' ?
      <div>
        <h3>显示按钮数量</h3>
        <p>在swagger页面中, API栏插入显示的最多按钮数量</p>
        <p>默认值是5, 当项目配置的按钮数量超出该值会以折叠的方式呈现</p>
        <p></p>
        <h3>JSON请求地址</h3>
        <p>当popup中开启新项目后, 会将当前的JSON请求地址配置到项目中</p>
      </div>
      :
      <div>
        <h3>Number of Buttons Displayed</h3>
        <p>The maximum number of buttons displayed in the API section on the Swagger page.</p>
        <p>The default value is 5. When the number of buttons configured in the project exceeds this value, they will be presented in a collapsed manner.</p>
        <p></p>
        <h3>JSON Request URL</h3>
        <p>When a new project is enabled in the popup, the current JSON request URL will be configured into the project.</p>
      </div>
    }

    </Collapse>
    <Collapse title={chrome.i18n.getMessage('generate_page')} onToggle={e => handleCollapseToggle('生成器配置', e)}>
      {chrome.i18n.getMessage('i18n') === '中文' ?
      <div>
        <h3>按钮名称</h3>
        <p>当前生成器在api后的按钮名字</p>
        <p></p>
        <h3>生成器代码</h3>
        <p>需要声明一个匿名函数, 该函数的作用是一个转换器, 并需要返回值, 插件调用该函数时会传入一个对象, 并接收转换后的数据用于点击按钮后生成代码</p>

        <p>转换器格式如下</p>
        <pre><code>{generateCode}</code></pre>
        <p>
          <span>传入data参格式如下</span>
          <span style={{fontSize: 10}}>(仅为示例，具体以JSON返回值为准)</span>
        </p>
        <pre><code>{apiCode}</code></pre>


        <p>提示: 可以先从编辑器中编辑完成, 调试没有错误再粘贴进来</p>
      </div>
      :
      <div>
        <h3>Button Name</h3>
        <p>The name of the button displayed after the API in the generator.</p>
        <p></p>
        <h3>Generator Code</h3>
        <p>You need to declare an anonymous function that serves as a converter and returns a value. When the plugin calls this function, it will pass an object and receive the converted data to generate code upon button click.</p>

        <p>
          <span>The converter format is as follows</span>

        </p>
        <pre><code>{generateCode}</code></pre>
        <p>
          <span>The format of the input data parameter is as follows</span>
          <span style={{fontSize: 10}}>(For example only, the JSON return value shall prevail)</span>
          <span>:</span>
        </p>
        <pre><code>{apiCode}</code></pre>

        <p>Tip: You can edit and debug the code in your editor without errors before pasting it here.</p>
      </div>
      }
    </Collapse>
    <Collapse title={chrome.i18n.getMessage('project_page')} onToggle={e => handleCollapseToggle('项目配置', e)}>
      {chrome.i18n.getMessage('i18n') === '中文' ?
        <div>
          <h3>URL</h3>
          <p>需要开启插件的页面地址, 支持星号匹配 </p>
          <p>例如: 配置为 https://xxx.com/v1, 则https://xxx.com/v1/xxx会匹配成功, https://xxx.com/v2/xxx会匹配失败</p>
          <p>例如: 配置的为 https://xxx/api/v1/*, 则所有以/https://xxx/api/v1/开头的地址都会匹配成功</p>
          <p>例如: 配置的为 *, 则所有地址都会匹配成功</p>

          <p></p>
          <h3>json地址配置</h3>
          <p>当前swagger的schema的json地址, 例如https://petstore.swagger.io的https://petstore.swagger.io/v2/swagger.json</p>
          <p>支持添加多个, 以回车区分</p>
          <p>支持全路径和相对路径</p>

          <h3>选择显示按钮</h3>
          <p>选择当前swagger页面中需要显示的按钮</p>
          <p>支持拖拽排序</p>
        </div>
        :
        <div>
          <h3>URL</h3>
          <p>The page addresses where the plugin should be enabled, supporting wildcard matching.</p>
          <p>For example: If configured as https://xxx.com/v1, then https://xxx.com/v1/xxx will match, but https://xxx.com/v2/xxx will not.</p>
          <p>For example: If configured as https://xxx/api/v1/*, then all addresses starting with https://xxx/api/v1/ will match.</p>
          <p>For example: If configured as *, then all addresses will match.</p>

          <p></p>
          <h3>JSON Request URL</h3>
          <p>The JSON schema URL of the current Swagger, such as https://petstore.swagger.io/v2/swagger.json for https://petstore.swagger.io.</p>
          <p>Supports adding multiple URLs, separated by line breaks.</p>
          <p>Supports both full and relative paths.</p>

          <h3>Select Buttons to Display</h3>
          <p>Select the buttons to display on the current Swagger page.</p>
          <p>Supports drag-and-drop sorting.</p>
        </div>
      }
    </Collapse>
    <Card>
      <Row>
        <Col width={260}>
          <div className="title">🧙 swagger-fields-generoator</div>
          <div className="slogan">{chrome.i18n.getMessage('slogan')}</div>
          <div className="connect">
            <a href={T_INVITE_URL} target="_blank" className="link" onClick={() => analytics.fireEvent('click', {page: 'Help', name: '查看飞机群'})}>
              <i className="iconfont icon-telegram"/>
            </a>
            <a href={DISCORD_INVITE_URL} target="_dlank" className="link" onClick={() => analytics.fireEvent('click', {page: 'Help', name: '查看discord'})}>
              <i className="iconfont icon-discord"/>
            </a>
            <a href={GITHUB_URL} target="_dlank" className="link" onClick={() => analytics.fireEvent('click', {page: 'Help', name: '查看github'})}>
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
          {
            chrome.i18n.getMessage('i18n') === '中文' ?
            <>
              <div style={{marginTop: 0, fontSize: 16}}>🏂 配置操作</div>
                <div style={{color: '#999'}}>
                  <p>配置可以按JSON的格式导出本地, 也可以从本地导入配置到插件中</p>
                  <p>当配置出现异常后, 可以导出配置文件, 在编辑器中修改后再导入到插件</p>
                  <p>或者点击恢复默认配置, 请注意: 此操作会永久丢失配置, 请注意导出备份</p>
                </div>
            </>
            :
            <>
              <div style={{marginTop: 0, fontSize: 16}}>🏂 Configuration Operations</div>
              <div style={{color: '#999'}}>
                  <p>Configurations can be exported locally in JSON format and imported back into the plugin.</p>
                  <p>If a configuration error occurs, you can export the configuration file, edit it in an editor, and then import it back into the plugin.</p>
                  <p>Alternatively, you can click "Restore Default Configuration." Please note: This action will permanently delete the current configuration. Ensure you have exported a backup before proceeding.</p>
              </div>
            </>
          }
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
