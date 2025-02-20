import { globalConfigStorageGet } from "~storage/global";
import request from "./request"
import { projectStorageGetByHost } from "~storage/project";
import { multiLine2array } from "~utils";

export const requestSource = async (href: string) => {
    const config = await globalConfigStorageGet()
    const tryList = []
    const project = await projectStorageGetByHost(href)
    if (config.enable === false) return
    if (!project || project.enable !==  true) return
    if (project && project.json) {
        tryList.push(...multiLine2array(project.json))
    } else {
        tryList.push(...multiLine2array(config.json))
    }
    for (let i = 0; i < tryList.length; i++) {
        try {
            return await request({ url: tryList[i] })
        } catch (error) {
            
        }
    }
    return null
}