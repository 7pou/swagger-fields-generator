import { useEffect, useState } from "react"
import { MessageType } from "./common/messageType"
import CodeEditor from "~components/Form/libs/CodeEditor"


const requestParamsformat = (parameters) => {
  return parameters?.filter(e => e.in === 'path')
}
const requestQueryformat = (parameters) => {
  return parameters?.filter(e => e.in === 'query')
}

const requestBodyformat = (requestBody) => {
  return requestBody
}
const responsesformat = (responses) => {
  return responses
}



/**
 * 抹平版本字段差异
 * @param jsonData
 */

const transferOpenapi = (pathSchema) => {
  const item: any = {}
  item.path = pathSchema.path;
  item.method = pathSchema.method;
  item.tags = pathSchema.tags
  item.summary = pathSchema.summary
  item.description = pathSchema.description
  item.operationId = pathSchema.operationId
  item.consumes = pathSchema.consumes
  item.produces = pathSchema.produces
  item.schema = pathSchema

  item.requestParams = requestParamsformat(pathSchema.parameters)
  item.requestBody = requestBodyformat(pathSchema.requestBody)
  item.requestQuery = requestQueryformat(pathSchema.parameters)
  item.responsesData = responsesformat(pathSchema.responses)

  return item
}

const IndexSandbox = () => {
  const [code, setCode] = useState("")
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [error, setError] = useState(null)
  useEffect(() => {
    const listener = (event: {data: {type: MessageType.SENDBOX_EXECUTE, code: string, input: any, json: any}}) => {
      console.log(event);
      if (event.data.type === MessageType.SENDBOX_EXECUTE) {
        try {
          const userFunction = new Function("return " + event.data.code)();
          const openapi = transferOpenapi(event.data.input);

          const result = userFunction(openapi)
          const code = typeof result === 'string' ? result : JSON.stringify(result, null, 2);
          setCode(code);
          setStatus('success');
          document.title = event.data.input.summary + ' ' + event.data.input.path;
        } catch (error) {
          console.log(error);
          setStatus('error');
          // setError(error);
        }
      }
    }
    window.addEventListener("message", listener);
    window.opener.postMessage({ type: MessageType.SENDBOX_LOADED }, "*");
    return () => window.removeEventListener("message", listener);
  }, [])
  if (status === 'loading') return <div>loading</div>
  if (status === 'error') return <div>{error}</div>
  return <CodeEditor value={code} disabled={true} />

}
export default IndexSandbox
