import * as defaults from './defaults'
import * as objects from './objects'
import { getServiceNameFromTag } from './getServiceFileModel'
import { Api } from './types'
import { camelCase, uniq, upperFirst } from './utils'
import { OpenAPIV2 } from 'openapi-types'
import { resolveType } from './resolveType'
import { getApiParameters } from './getApiParameters'
import { addApiDeps } from './addApiDeps'
import { getApiRequestConfigEntries } from './getApiRequestConfigEntries'



export function getApi({
  path = '',
  opName = '',
  opObj = defaults.operationObject(),
}): Api {
  const api = objects.api({
    service: getServiceNameFromTag(opObj.tags?.[0]),
    description: opObj.description ?? '',
    summary: opObj.summary ?? '',
    method: opName,
    url: path,
  })
  api.identifier = determineApiIdentifier({
    api, path, opName, opObj,
  })
  api.parameters = getApiParameters({ api, opObj })
  api.sendFormData = api.parameters.some(e => e.passIn === 'formData')
  api.paramsType = getApiParamsType({ api, opObj })
  api.resType = getApiResType({ api, opObj })
  api.requestConfigEntries = getApiRequestConfigEntries({ api })
  return api
}



function getApiParamsType({
  api = objects.api(),
  opObj = defaults.operationObject(),
}): string {
  let paramsType = ''
  if (shouldExtractParameters(api)) {
    paramsType = extractApiParameters(api)
  } else if (api.parameters.length) {
    paramsType = api.parameters[0].type
  }
  return paramsType
}

function extractApiParameters(api: Api): string {
  const identifier = upperFirst(`${api.identifier}Params`)
  const { parameters } = api
  const deps = uniq(parameters.reduce((list, parameter) =>
      list.concat(parameter.deps), Array<string>()))
  const objectSchema = objects.objectSchema({
    identifier,
    properties: parameters,
    deps,
  })
  api.extracts.unshift(objectSchema)
  return identifier 
}




function shouldExtractParameters(api: Api): boolean {
  const should = (
    api.parameters.length > 1 ||
    (
      api.parameters.length === 1 &&
      !api.parameters[0].deps.length
    )
  )
  return should
}







function getApiResType({
  api = objects.api(),
  opObj = defaults.operationObject(),
}): string {
  let resType = 'void'
  const response = opObj.responses['200']
  if (isResponseResponseObject(response)) {
    if (response.schema) {
      const { typeValue, deps } = resolveType(response.schema)
      resType = typeValue
      addApiDeps(api, deps)
    }
  }
  return resType
}




























function determineApiIdentifier({
  api = objects.api({}),
  path = '',
  opName = '',
  opObj = defaults.operationObject(),
}): string {
  // const method = api.method.toLowerCase()
  // const opNameInferred = this.inferApiOpName(api)
  // let identifier = ''
  // return identifier
  return opObj.operationId || camelCase(api.url)
}













function isResponseResponseObject(
  obj: OpenAPIV2.Response | undefined,
): obj is OpenAPIV2.ResponseObject {
  return typeof (obj as any)?.description === 'string'
}






