import { getServiceNameFromTag } from './getServiceOutputModel'
import { camelCase, upperFirst } from '../utils'
import { OpenAPIV2 } from 'openapi-types'
import { resolveType } from './resolveType'
import { getApiParameters } from './getApiParameters'
import { getApiRequestConfigEntries } from './getApiRequestConfigEntries'
import { objects } from '../objects'
import { Api } from '../entities/Api'
import { ResolvedType } from '../entities/ResolvedType'
import { ObjectSchema } from '../entities/ObjectSchema'
import { invokeConfigCallback } from '../invokeConfigCallback'
import { ConfigCallbacks } from '../types'



export function getApi({
  path = '',
  opName = '',
  opObj = objects.operationObject(),
}): Api {
  const api = Api.create({
    service: getServiceNameFromTag(opObj.tags?.[0]),
    description: opObj.description ?? '',
    summary: opObj.summary ?? '',
    method: opName,
    url: clearApiUrlPrefix(path),
    operationId: opObj.operationId,
  })
  api.identifier = determineApiIdentifier({
    api, path, opName, opObj,
  })
  api.parameters = getApiParameters({ api, opObj })
  api.paramsType = getApiParamsType({ api, opObj })
  api.resType = getApiResType({ api, opObj })
  api.requestConfigEntries = getApiRequestConfigEntries({ api })
  return api
}



function getApiParamsType({
  api = Api.create(),
  opObj = objects.operationObject(),
}): ResolvedType {
  let paramsType = ResolvedType.create()
  if (shouldExtractParameters(api)) {
    paramsType = extractApiParameters(api)
  } else if (api.parameters.length) {
    paramsType = api.parameters[0].type
  }
  return paramsType
}

function extractApiParameters(api: Api): ResolvedType {
  const identifier = upperFirst(`${api.identifier}Params`)
  const { parameters } = api
  const objectSchema = ObjectSchema.create({
    identifier,
    properties: parameters,
  })
  api.extracts.unshift(objectSchema)
  return ResolvedType.typeSymbol(identifier, {
    depsExcludeSymbols: [identifier],
  })
}



function shouldExtractParameters(api: Api): boolean {
  const should = (
    api.parameters.length > 1 ||
    (
      api.parameters.length === 1 &&
      !api.parameters[0].type.symbolDeps.length
    )
  )
  return should
}





function getApiResType({
  api = Api.create(),
  opObj = objects.operationObject(),
}): ResolvedType {
  let resType = ResolvedType.voidType()
  const response = opObj.responses['200']
  if (isResponseResponseObject(response)) {
    if (response.schema) {
      resType = resolveType(response.schema)
    }
  }
  return resType
}



function determineApiIdentifier({
  api = Api.create(),
  path = '',
  opName = '',
  opObj = objects.operationObject(),
}): string {
  const nameConfigured = invokeConfigCallback(ConfigCallbacks.apiNamingMethod, [api])
  if (nameConfigured) {
    return nameConfigured
  }
  return api.operationId
}




function clearApiUrlPrefix(url: string) {
  if (global.apiGenConfig.prefix) {
    url = url.replace(
      global.apiGenConfig.prefix,
      '',
    )
  }
  return url
}






function isResponseResponseObject(
  obj: OpenAPIV2.Response | undefined,
): obj is OpenAPIV2.ResponseObject {
  return typeof (obj as any)?.description === 'string'
}






