import { uuid } from "~utils";



export const defaultConfig = {
    selector: {
        opblockTag: '.opblock-tag',
        opblockTagSection: '.opblock-tag-section',
        opblockSummary: '.opblock-summary',
        opblockSummaryPath: '.opblock-summary-path',
        opblockSummaryMethod: '.opblock-summary-method',
    },
    global: {
        maxBtn: 5,
        enable: true,
        updateTime: new Date().toLocaleString(),
        json: [
            '/api-docs-json',
            '/v2/swagger.json',
            '/api/swagger.json',
            '/v2/api-docs',
            '/v1/swagger.json',
            '/api/v1/api-docs',
            '/api/v2/api-docs',
        ].join('\r'),
    },
    generator: [
      {
        enable: true,
        uuid: 'auto-generator-1',
        btnName: 'Antd Column',
        createTime: new Date().toLocaleString(),
        code: `function (data) {
          const result = []
          if (data.responsesData && data.responsesData.type === 'object' ) {
            const properties = data.responsesData.properties
            for (const key in properties) {
              result.push({
                key,
                type: properties[key].type,
                label: properties[key].description,
              })
            }
          }
          return result
        }`
      },
      {
        enable: true,
        uuid: 'auto-generator-2',
        btnName: 'response TS',
        createTime: new Date().toLocaleString(),
        code: 'function (data) {\nreturn data.responsesDataType;\n}'
      },
      {
        enable: true,
        uuid: 'auto-generator-3',
        btnName: 'form fields',
        createTime: new Date().toLocaleString(),
        code: `function(data) {
  const result = []
  if (data.requestBody && data.requestBody.type === 'object') {
    const properties = data.requestBody.properties || {}
    for (const key in properties) {
      result.push({
        key,
        type: properties[key].type,
        label: properties[key].description,
      })
    }
  }
  return result
}`
      },
      {
        enable: true,
        uuid: 'auto-generator-4',
        btnName: 'original data',
        createTime: new Date().toLocaleString(),
        code: 'function (data) {\nreturn data;\n}'
      },
    ],
    project: [
        {
            enable: true,
            uuid: uuid(),
            btns: 'auto-generator-1,auto-generator-2',
            url: 'https://petstore.swagger.io',
            json: '/v2/swagger.json',
            createTime: new Date().toLocaleString(),
        },
        {
            enable: true,
            uuid: 'auto-project-1',
            btns: 'auto-generator-1,auto-generator-2',
            url: '*',
            json: '/api-docs-json\r/v2/swagger.json\r/api/swagger.json\r/v2/api-docs\r/v1/swagger.json\r/api/v1/api-docs\r/api/v2/api-docs',
            createTime: new Date().toLocaleString(),
        }
    ]

}
