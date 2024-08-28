import { ensureValidObjectKey, regParemterWithAccessPath, valueOfType } from '../utils';
import { OpenAPIV2 } from 'openapi-types';
import { resolveType } from './resolveType';
import { Api } from '../entities/Api';
import { objects } from '../objects';
import { ApiParameter } from '../entities/ApiParameter';
import { invokeConfigCallback } from '../invokeConfigCallback';
import { ConfigCallbacks } from '../types';

export function getApiParameters({
  api = Api.create(),
  opObj = objects.operationObject(),
}): ApiParameter[] {
  const { parameters = [] } = opObj
  const parametersNormal = getNormalParameterObjects(parameters)
  return parametersNormal.map(parameter =>
      getApiParameter({ parameter, api }))
}


function getApiParameter({
  parameter = valueOfType<OpenAPIV2.ReferenceObject | OpenAPIV2.Parameter>(objects.referenceObject()),
  api = Api.create(),
}): ApiParameter {
  const parameterAny = parameter as any
  const apiParam = ApiParameter.create({
    identifier: ensureValidObjectKey(parameterAny.name),
    description: parameterAny.description ?? '',
    passIn: parameterAny.in,
    required: parameterAny.required ?? false,
  })
  if (isParameterGeneralParameterObject(parameter)) {
    const type = resolveType({
      type: parameter.type,
      format: parameter.format,
    })
    apiParam.type = type
  } else if (isParameterInBodyParameterObject(parameter)) {
    invokeConfigCallback(ConfigCallbacks.eachInputTypeSchemaObject, [parameter.schema])
    const type = resolveType(parameter.schema)
    apiParam.type = type
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



