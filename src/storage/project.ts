import { Storage } from "@plasmohq/storage"
import { isTargetUrl, uuid } from "~utils"
export interface ProjectConfigProps {
    uuid?: string
    enable?: boolean
    btns?: string
    url?: string
    json?: string
    loadJsonSuccess?: boolean
    createTime?: string
    updateTime?: string
}
const storage = new Storage()
export const key = 'swagger-fields-generator-project'

export const projectStorageGet = (): Promise<ProjectConfigProps[]> => {
    return storage.getItem<Array<ProjectConfigProps>>(key)
}
export const projectStorageGetByHost = (host: string): Promise<ProjectConfigProps> => {
    return storage.getItem<Array<ProjectConfigProps>>(key).then((data) => {
        return data?.find((item) => isTargetUrl(host, item.url))
    })
}
export const projectStorageSet = (data) => {
    return storage.setItem(key, data)
}

export const projectStorageUpdate = (item) => {
    item.updateTime = new Date().toLocaleString()
    return projectStorageGet().then(res => {
        const data = (res || []).map((e) => {
            if (e.uuid === item.uuid) {
                return item
            }
            return e
        })
        return storage.setItem(key, data)
    })
}
export const projectStorageInsert = (item) => {
    item.enable = true
    item.uuid = uuid()
    item.createTime = new Date().toLocaleString()
    return projectStorageGet().then(res => {
        const data = (res || []).concat(item)
        return storage.setItem(key, data)
    })
}