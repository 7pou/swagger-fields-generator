import { useEffect, useState } from "react"
import { MessageType } from "~common/messageType"
import { deepClone } from "~utils"
const requestParamsformat = (data) => {}
const requestBodyformat = (data) => {}
const responsesformat = (data) => {}


/**
 * 抹平版本字段差异
 * @param jsonData 
 */

const data = (req) => {
  const item: any = {}
  item.method = req.method;

  item.operationId = req.operationId
  item.summary = req.summary
  item.tags = req.tags?.[0]
  item.description = req.description
  item.consumes = req.consumes
  item.produces = req.produces
  item.requestParams = requestParamsformat(req)
  item.requestBody = requestBodyformat(req)
  item.responsesData = responsesformat(req)
}

export const jsonformat = (jsonData) => {
    const paths = Object.keys(jsonData.paths)
    const result = []
    function findSchema(ref, schema) {
        if (!ref) return null
        const parts = ref.split('/').slice(1); // 移除 `#`
        let result = deepClone(schema);
        
        for (const part of parts) {
            if (result && result[part]) {
                result = result[part];
            } else {
                return null; // 未找到
            }
        }
        return result;
    }

    for (let i = 0; i < paths.length; i++) {
        const item: any = {}
        item.path = paths[i];
        const methodObj = jsonData.paths[item.path]
        const methods = Object.keys(methodObj)

        for (let i = 0; i < methods.length; i++) {
            
        }
        result.push(item)
    }
    return result
}

const IndexSandbox = () => {
  const [code, setCode] = useState("")
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  useEffect(() => {
    const listener = (event) => {
      if (event.data.type === MessageType.EXECUTE) {
        try {
          const userFunction = new Function("return " + event.data.code)();
          // const a = jsonformat(event.data.input);
          const result = userFunction(event.data.input)
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