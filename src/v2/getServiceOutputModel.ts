import { Api } from "../entities/Api"
import { ImportDecl, ImportDeclItem } from "../entities/ImportDecl"
import { ServiceOutputModel } from "../entities/ServiceOutputModel"
import { invokeConfigCallback } from "../invokeConfigCallback"
import { includesCN, normalizeCN } from "../normalizeCN"
import { normalizeIdentifier } from "../normalizeIdentifier"
import { objects } from "../objects"
import { ConfigCallbacks } from "../types"
import {
  camelCase,
  ifElement,
  regIdentifierOddChars,
  uniq,
} from "../utils"



export function getServiceOutputModel({
  tag = objects.tagObject(),
  apisAll = Array<Api>(),
}): ServiceOutputModel {
  const name = getServiceNameFromTag(tag.name)
  const apis = apisAll.filter(e => e.service === name)
  const imports = getImports({ apis })
  const service = ServiceOutputModel.create({
    tag: tag.name,
    name,
    apis,
    imports,
  })
  apis.forEach(api => invokeConfigCallback(ConfigCallbacks.eachApi, [{
    api, service,
  }]))
  return service
}


function getImports({
  apis = Array<Api>(),
}): ImportDecl[] {
  const imports = [
    ImportDecl.create({
      defaultItem: ImportDeclItem.create({
        identifier: 'client',
      }),
      namedItems: [
        ImportDeclItem.create({
          identifier: 'ClientRequestConfig',
          isType: true,
        }),
        ImportDeclItem.create({
          identifier: 'ClientApiResponse',
          isType: true,
        }),
      ],
      module: global.apiGenConfig.clientPath,
    })
  ]
  const typeSymbolDeps = uniq(apis.flatMap(e => e.typeSymbolDeps))
  imports.push(
    ...typeSymbolDeps.map(identifier => {
      return ImportDecl.create({
        namedItems: [
          ImportDeclItem.create({
            identifier,
            isType: true,
          })
        ],
        module: `../schemas/${identifier}`,
      })
    }),
  )
  return imports
}



export function getServiceNameFromTag(str: string = '') {
  if (includesCN(str)) {
    str = str.replace(regIdentifierOddChars, '')
    str = camelCase(normalizeCN(str))
    return str
  }
  return camelCase(str)
}




