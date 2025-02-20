import { Storage } from "@plasmohq/storage"
export interface GlobalConfigProps {
    enable?: boolean
    language?: 'zh-CN' | 'en-US'
    json?: string
    maxBtn?: number
    updateTime?: string
}
const storage = new Storage()
export const key = 'swagger-fields-generator-global'
export const globalConfigStorageGet = () : Promise<GlobalConfigProps> => {
    return storage.getItem<GlobalConfigProps>(key).then((data) => {
        return data
    })
}

export const globalConfigStorageSet = (data) => {
    return storage.setItem(key, data)
}