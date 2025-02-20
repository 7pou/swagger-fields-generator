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