import { OpenAPIV2 } from 'openapi-types'
import * as defaults from './defaults'
import * as objects from './objects'
import { getSchemaFileModel } from './getSchemaFileModel'
import { Api, ParseResult, ServiceFileModel } from './types'
import { getServiceFileModel } from './getServiceFileModel'
import { getApi } from './getApi'


export default function parse({
  input = defaults.openApiV2Doc(),
}): ParseResult {
  const schemas = getSchemas(input)
  const services = getServices(input)
  const main = getMainFileModel({ services })
  return {
    schemas,
    services,
    main,
  }
}


function getSchemas(input: OpenAPIV2.Document) {
  return Object.entries(input.definitions ?? {})
    .map(([defName, defObj]) => getSchemaFileModel({ defName, defObj }))
}


function getServices(input: OpenAPIV2.Document) {
  const apis = getAllApi(input)
  const services = (input.tags ?? []).map(tag => getServiceFileModel({
    tag, apisAll: apis,
  }))
  return services
}


function getAllApi(input: OpenAPIV2.Document): Api[] {
  const apis = Object.entries(input.paths)
    .flatMap(([path, pathObj]) => {
      return Object.entries(pathObj)
        .map(([opName, opObj]) => {
          return getApi({
            path,
            opName,
            opObj: opObj as OpenAPIV2.OperationObject,
          })
        })
    })
  return apis
}


function getMainFileModel({
  services = Array<ServiceFileModel>(),
}) {
  const mainFileModel = objects.mainFileModel({
    services,
    imports: services.map(service => {
      return objects.importDecl({
        namespace: service.name,
        module: `./services/${service.name}`,
      })
    }),
  })
  return mainFileModel
}


