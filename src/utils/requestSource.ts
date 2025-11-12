import { globalConfigStorageGet } from "~storage/global";
import request from "./request"
import { projectStorageGetByHost } from "~storage/project";
import { parseTryUrls } from "~utils";

export const requestSource = async (origin: string) => {

    const config = await globalConfigStorageGet()
    const tryList = []
    const project = await projectStorageGetByHost(origin)

    if (!project) return
    if (project && project.json) {
        tryList.push(...parseTryUrls(project.json, origin))
    } else {
        tryList.push(...parseTryUrls(config.json, origin))
    }
    for (let i = 0; i < tryList.length; i++) {
      const res = await request({ url: tryList[i] }).catch((err) => {
        return null
      })
      if (res) return await res.json()
    }
    return null
}
