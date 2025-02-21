import { Storage } from "@plasmohq/storage"
import { key as generatorKey } from "./generator"
import { key as projectKey } from "./project"
import { key as globalKey } from "./global"
import { defaultConfig } from "~common/defaultConfig"

export const getStorageConfig = async () => {
    const storage = new Storage()
    return await storage.getAll()
}

export const setDefaultStorageConfig = async () => {
    const storage = new Storage()

    storage.setItem(generatorKey, defaultConfig.generator)
    storage.setItem(projectKey, defaultConfig.project)
    storage.setItem(globalKey, defaultConfig.global)
}

export const setOptionsPageParams =  async (params: any) => {
  const storage = new Storage()
  await storage.setItem('options-page-params', params)
}

export const getOptionsPageParams =  async () => {
  const storage = new Storage()
  const params = await storage.getItem('options-page-params')
  await storage.removeItem('options-page-params')
  return params
}
