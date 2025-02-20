import { Storage } from "@plasmohq/storage"
export interface GenerateConfigProps {
    uuid?: string
    createTime?: string
    updateTime?: string
    enable?: boolean
    btnName?: string
    code?: string
}
const storage = new Storage()
const key = 'swagger-fields-generator-generate'

export const generatorStorageGet = (): Promise<GenerateConfigProps[]> => {
    return storage.getItem<Array<GenerateConfigProps>>(key)
}
export const generatorStorageGetByUuid = (uuids:string[]): Promise<GenerateConfigProps[]> => {
    return generatorStorageGet().then((data) => {
        return data.filter((item) => uuids.includes(item.uuid))
    })
}
export const generatorStorageSet = (data) => {
    return storage.setItem(key, data)
}