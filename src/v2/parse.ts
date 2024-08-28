import { OpenAPIV2 } from 'openapi-types'
import { getServiceOutputModel } from './getServiceOutputModel'
import { getApi } from './getApi'
import { objects } from '../objects'
import { ParseResult } from '../entities/ParseResult'
import { getSchemaOutputModel } from './getSchemaOutputModel'
import { Api } from '../entities/Api'
import { ServiceOutputModel } from '../entities/ServiceOutputModel'
import { MainOutputModel } from '../entities/MainOutputModel'
import { ImportDecl } from '../entities/ImportDecl'


export default function parse({
  input = objects.openApiV2Doc(),
}): ParseResult {
  const schemas = getSchemas(input)
  const services = getServices(input)
  const main = getMainFileModel({ services })
  return ParseResult.create({
    schemas,
    services,
    main,
  })
}


function getSchemas(input: OpenAPIV2.Document) {
  return Object.entries(input.definitions ?? {})
    .map(([defName, defObj]) => getSchemaOutputModel({ defName, defObj }))
}


function getServices(input: OpenAPIV2.Document) {
  const apis = getAllApi(input)
  const services = (input.tags ?? []).map(tag => getServiceOutputModel({
    tag,
    apisAll: apis,
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
  services = Array<ServiceOutputModel>(),
}): MainOutputModel {
  const mainFileModel = MainOutputModel.create({
    services,
    imports: services.map(service => {
      return ImportDecl.create({
        namespace: service.name,
        module: `./services/${service.name}`,
      })
    }),
  })
  return mainFileModel
}


