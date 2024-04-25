import * as objects from './objects'
import * as defaults from './defaults'
import { Api, ApiParameter } from "./types";
import { assign, ensureValidObjectKey, regParemterWithAccessPath } from './utils';
import { OpenAPIV2 } from 'openapi-types';
import { resolveType } from './resolveType';
import { addApiDeps } from './utils'

export function getApiParameters({
  api = objects.api({}),
  opObj = defaults.operationObject(),
}): ApiParameter[] {
  const { parameters = [] } = opObj
  const parametersNormal = getNormalParameterObjects(parameters)
  return parametersNormal.map(parameter =>
      getApiParameter({ parameter, api }))
}


function getApiParameter({
  parameter = defaults.oneOf(
    defaults.referenceObject(),
    defaults.parameter(),
  ),
  api = objects.api(),
}): ApiParameter {
  const parameterAny = parameter as any
  const apiParam = objects.apiParameter({
    identifier: ensureValidObjectKey(parameterAny.name),
    description: parameterAny.description ?? '',
    passIn: parameterAny.in,
    required: parameterAny.required ?? false,
  })
  if (isParameterGeneralParameterObject(parameter)) {
    const { typeValue, deps } = resolveType({
      type: parameter.type,
      format: parameter.format,
    })
    assign(apiParam, { type: typeValue, deps })
    addApiDeps(api, deps)
  } else if (isParameterInBodyParameterObject(parameter)) {
    const { typeValue, deps } = resolveType(parameter.schema)
    assign(apiParam, { type: typeValue, deps })
    addApiDeps(api, deps)
  }
  return apiParam
}




function getNormalParameterObjects(parameters: OpenAPIV2.Parameters) {
  const namesUniq = new Set<string>()
  const parametersNormal = parameters.flatMap((p) => {
    const parameter = p as any
    if (isParameterHasAccessPath(parameter)) {
      const name = normalizeParameterName(parameter.name)
      if (namesUniq.has(name)) {
        return []
      } else {
        namesUniq.add(name)
        const parameterNew = {
          ...parameter,
          name,
          required: false,
          type: 'any',
        }
        return [parameterNew]
      }
    } else {
      return [parameter]
    }
  })
  return parametersNormal
}










function isParameterHasAccessPath(parameter: OpenAPIV2.ReferenceObject | OpenAPIV2.Parameter) {
  return regParemterWithAccessPath.test(String((parameter as any).name))
}

function normalizeParameterName(name: string) {
  if (regParemterWithAccessPath.test(name)) {
    return name.match(regParemterWithAccessPath)?.[1] ?? ''
  }
  return name
}


function isParameterGeneralParameterObject(
  obj: OpenAPIV2.ReferenceObject | OpenAPIV2.Parameter,
): obj is OpenAPIV2.GeneralParameterObject {
  return typeof (obj as any).type === 'string'
}

function isParameterInBodyParameterObject(
  obj: OpenAPIV2.ReferenceObject | OpenAPIV2.Parameter,
): obj is OpenAPIV2.InBodyParameterObject {
  return typeof (obj as any).schema === 'object'
}



