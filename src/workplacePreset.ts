import { nameApiWithUrlAndMethod } from "./nameApiWithUrlAndMethod";
import { GenArgs } from "./types";
import { outputFile } from "fs-extra"
import { resolve } from "path"
import { Api } from "./entities/Api"
import { ResolvedType } from "./entities/ResolvedType"
import { ServiceOutputModel } from "./entities/ServiceOutputModel"
import { ImportDecl, ImportDeclItem } from "./entities/ImportDecl"


function rewriteCapitalStringRefSchema(schema: any) {
  if (schema.$ref === '#/definitions/String') {
    delete schema.$ref
    schema.type = 'string'
  }
}

export async function outputPageDTOParamsSchema({
  schemaName = 'PageDTOQueryParams',
  pageSizeKey = 'pageSize',
  pageNumKey = 'pageNum',
} = {}) {
  const path = resolve(global.apiGenConfig.output, `./schemas/${schemaName}.ts`)
  await outputFile(
    path,
    `/* eslint-disable */
export type ${schemaName}<T = {}> =  T & {
  ${pageNumKey}?: number;
  ${pageSizeKey}?: number;
}
`,
  )
}

function addPageDTOQueryParams(arg: any, {
  schemaName = 'PageDTOQueryParams',
} = {}) {
  const api = arg.api as Api
  const service = arg.service as ServiceOutputModel
  const isPageDTO = api.resType.value.startsWith('PageDTO')
  if (isPageDTO) {
    api.paramsType = ResolvedType.typeSymbol(schemaName, {
      typeArguments: [api.paramsType],
      depsExcludeSymbols: [api.paramsType.value],
    })
    if (
      !service.imports.find(e => e.module.includes(schemaName))
    ) {
      service.imports.push(ImportDecl.create({
        namedItems: [ImportDeclItem.create({
          identifier: schemaName,
          isType: true,
        })],
        module: `../schemas/${schemaName}`,
      }))
    }
    // if (!api.parameters.find(param => param.identifier === pageSizeKey)) {
    //   api.parameters.push(ApiParameter.create({
    //     passIn: 'query',
    //     identifier: pageSizeKey,
    //     type: ResolvedType.number(),
    //   }))
    // }
    // if (!api.parameters.find(param => param.identifier === pageNumKey)) {
    //   api.parameters.push(ApiParameter.create({
    //     passIn: 'query',
    //     identifier: pageNumKey,
    //     type: ResolvedType.number(),
    //   }))
    // }
  }
}



export function workplacePreset(config: GenArgs) {
  config.apiNamingMethod = nameApiWithUrlAndMethod
  config.eachApi = (arg) => {
    addPageDTOQueryParams(arg)
  }
  config.eachInputTypeSchemaObject = (arg) => {
    rewriteCapitalStringRefSchema(arg)
  }
  config.afterOutput = () => {
    outputPageDTOParamsSchema()
  }
}
