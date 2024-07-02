import * as defaults from './defaults'
import * as objects from './objects'
import { Api, ImportDecl, ServiceFileModel } from "./types"
import { camelCase, ifElement, includesCN, normalizeCN, uniq } from "./utils"



export function getServiceFileModel({
  tag = defaults.tagObject(),
  apisAll = Array<Api>(),
}): ServiceFileModel {
  const name = getServiceNameFromTag(tag.name)
  const apis = apisAll.filter(e => e.service === name)
  const imports = Array<ImportDecl>()
  imports.push(objects.importDecl({
    defaultExport: 'client',
    namedExports: [
      'type ClientRequestConfig',
      'type ApiResObject',
      ...ifElement(
        apis.some(e => e.sendFormData),
        'transformParamsToFormData',
      ),
    ],
    module: global.apiGenConfig.clientPath,
  }))
  imports.push(...uniq(apis.flatMap(e => e.deps))
    .map(e => objects.importDecl({
      namedExports: [`type ${e}`],
      module: `../schemas/${e}`,
    })))
  const service = objects.serviceFileModel({
    tag: tag.name,
    name,
    apis,
    imports,
  })
  return service
}





export function getServiceNameFromTag(str: string = '') {
  if (includesCN(str)) {
    str = camelCase(normalizeCN(str))
    return str
  }
  str = str.match(/^(.+)-controller/)?.[1] ?? ''
  return camelCase(str)
}




