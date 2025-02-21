import { useEffect, useState } from "react"
import { MessageType } from "~common/messageType"
import { deepClone } from "~utils"
const requestParamsformat = (api, model) => {
  const params = api.parameters?.filter((p) => p.in === 'query')
  if (!params) return null
  const schema = findSchema(params.schema, model)
  return schema
}
const requestBodyformat = (api, model) => {
  const body = api.parameters?.find((p) => p.in === 'body')
  if (!body) return null
  const schema = findSchema(body.schema, model)
  return schema
}
const responsesformat = (data,model) => {
  const res = data?.responses?.['200']
  if (!res) return null
  const schema = findSchema(res.schema, model)
  return schema
}

const findSchema = (obj, definitions) => {
  if (!obj) return obj
  if (obj && obj.$ref) {
    let copyDefinitions = deepClone(definitions)
    const refPaths = obj.$ref.split('/')
    for (let i = 1; i < refPaths.length; i++) {
      const path = refPaths[i];
      copyDefinitions = copyDefinitions[path]
    }
    obj = findSchema(copyDefinitions, definitions)
  }
  if (obj.type === 'array') {
    obj.items = findSchema(obj.items, definitions)
  }

  if (obj.type === 'object') {
    const properties = obj.properties
    const result = {}
    for (let key in properties) {
      result[key] = findSchema(properties[key], definitions)
    }
    obj.properties = result
  }
  return obj
}

/**
 * 抹平版本字段差异
 * @param jsonData
 */

const transferOpenapi = (api, json) => {
  const item: any = {}
  item.path = api.path;
  item.method = api.method;
  item.tags = api.tags?.[0]
  item.summary = api.summary
  item.description = api.description
  item.operationId = api.operationId
  item.consumes = api.consumes
  item.produces = api.produces

  item.requestParams = requestParamsformat(api, json)
  item.requestBody = requestBodyformat(api, json)
  item.responsesData = responsesformat(api, json)

  return item
}

const IndexSandbox = () => {
  const [code, setCode] = useState("")
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  useEffect(() => {
    const listener = (event) => {
      if (event.data.type === MessageType.EXECUTE) {
        try {
          const userFunction = new Function("return " + event.data.code)();
          const openapi = transferOpenapi(event.data.input, event.data.json);

          const result = userFunction(openapi)
          const code = typeof result === 'string' ? result : JSON.stringify(result, null, 2);
          setCode(code);
          setStatus('success');
          document.title = event.data.input.summary + ' ' + event.data.input.path;
        } catch (error) {
          setStatus('error');
        }
      }
    }
    window.addEventListener("message", listener);
    window.opener.postMessage({ type: MessageType.SENDBOX_LOADED }, "*");
    return () => window.removeEventListener("message", listener);
  }, [])
  if (status === 'loading') return <div>loading</div>
  if (status === 'error') return <div>error</div>
  return <pre>
    <code>{code}</code>
  </pre>
}
export default IndexSandbox
