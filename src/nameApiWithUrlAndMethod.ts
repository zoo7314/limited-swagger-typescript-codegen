import { camelCase } from "./utils"

export function nameApiWithUrlAndMethod(api: any) {
  let { url, method } = api
  url = url.replace(/\{(.+)}/g, 'by/$1')
  return camelCase(`${method},${url}`)
}

