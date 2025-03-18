import { useEffect, useState } from "react"
import { MessageType } from "~common/messageType"
import { compileJsonSchemaToTs, deepClone, formatType } from "~utils"

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
const requestParamsformat = (api, model) => {
  if (model.swagger) {
    const params = api.parameters?.filter((p) => p.in === 'query')
    if (!params || params.length === 0) return null
    const schema = findSchema(params, model)
    return schema
  }
  if (model.openapi) {
    const params = api.parameters
    if (!params || params.length === 0) return null
    const schema = findSchema(params, model)
    return schema
  }
  return null
}
const requestBodyformat = (api, model) => {
  if (model.swagger) {
    const body = api.parameters?.find((p) => p.in === 'body')
    if (!body) return null
    const schema = findSchema(body.schema, model)
    return schema
  }
  if (model.openapi) {
    const body = api.requestBody
    if (!body) return null
    const jsonschema = findSchema(body.content?.['application/json']?.schema, model)
    const xmlschema = findSchema(body.content?.['application/xml']?.schema, model)
    const textschema = findSchema(body.content?.['text/plain']?.schema, model)
    const htmlschema = findSchema(body.content?.['text/html']?.schema, model)
    const binaryschema = findSchema(body.content?.['application/octet-stream']?.schema, model)
    const multipartschema = findSchema(body.content?.['multipart/form-data']?.schema, model)
    const formdataschema = findSchema(body.content?.['application/x-www-form-urlencoded']?.schema, model)
    const schema = jsonschema || xmlschema || textschema || htmlschema || binaryschema || multipartschema || formdataschema
    if (schema) {
      schema.origin = body
    }
    return schema
  }
  return null
}
const responsesformat = (data,model) => {
  const res = data?.responses?.['200']
  if (!res) return null
  if (model.swagger) {
    return findSchema(res.schema, model)
  }
  if (model.openapi) {
    let schema  = null
    const jsonschema = res.content?.['application/json']?.schema
    const xmlschema = res.content?.['application/xml']?.schema
    const textschema = res.content?.['text/plain']?.schema
    const htmlschema = res.content?.['text/html']?.schema
    const binaryschema = res.content?.['application/octet-stream']?.schema
    const multipartschema = res.content?.['multipart/form-data']?.schema
    const formdataschema = res.content?.['application/x-www-form-urlencoded']?.schema
    schema = jsonschema || xmlschema || textschema || htmlschema || binaryschema || multipartschema || formdataschema
    // 如果只有一个属性，并且没有type，则判断类型
    if (Object.keys(schema).length === 1 && !schema.type) {
      schema.type =  formatType(schema[Object.keys(schema)[0]])
    }
    return findSchema(schema, model)
  }
  return null
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
  item.requestParamsType = compileJsonSchemaToTs(item.requestParams)
  item.requestBodyType = compileJsonSchemaToTs(item.requestBody)
  item.responsesDataType = compileJsonSchemaToTs(item.responsesData)

  return item
}

const IndexSandbox = () => {
  const [code, setCode] = useState("")
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [error, setError] = useState(null)
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
          setError(error);
        }
      }
    }
    window.addEventListener("message", listener);
    window.opener.postMessage({ type: MessageType.SENDBOX_LOADED }, "*");
    return () => window.removeEventListener("message", listener);
  }, [])
  if (status === 'loading') return <div>loading</div>
  if (status === 'error') return <div>{error}</div>
  return <pre>
    <code>{code}</code>
  </pre>
}
export default IndexSandbox
