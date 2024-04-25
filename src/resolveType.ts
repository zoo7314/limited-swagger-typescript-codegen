import { OpenAPIV2 } from "openapi-types"
import { ResolvedType } from "./types"
import { isNullish, uniq } from "./utils"
import { getRefIdentifier } from "./normalizeIdentifier"


export function resolveType(
  schemaObject: OpenAPIV2.SchemaObject,
  {
    deps = Array<string>(0),
  } = {},
): ResolvedType {

  let typeValue = undefined

  typeValue ??= caseBoolean(schemaObject)
  typeValue ??= caseNumber(schemaObject)
  typeValue ??= caseString(schemaObject)
  typeValue ??= caseFile(schemaObject)
  typeValue ??= caseUnion(schemaObject)
  typeValue ??= caseRef(schemaObject, { deps })
  typeValue ??= caseArray(schemaObject, { deps })
  typeValue ??= caseObject(schemaObject, { deps })
  typeValue ??= caseAny(schemaObject)
  typeValue ??= 'any'

  return {
    typeValue,
    deps: uniq(deps),
  }
}



function caseObject(
  schemaObject: OpenAPIV2.SchemaObject,
  {
    deps = Array<string>(0),
  } = {},
) {
  const { type, items, additionalProperties } = schemaObject
  if (type === 'object') {
    let typeValue: string | undefined = undefined
    typeValue = 'object'
    if (
      additionalProperties &&
      typeof additionalProperties === 'object'
    ) {
      const recordSchema = additionalProperties as OpenAPIV2.SchemaObject
      const valueType = resolveType(recordSchema, { deps }).typeValue
      typeValue = `Record<string, ${valueType}>`
    }
    return typeValue
  }
}





function caseArray(
  schemaObject: OpenAPIV2.SchemaObject,
  {
    deps = Array<string>(0),
  } = {},
) {
  const { type, items } = schemaObject
  if (type === 'array') {
    if (!isNullish(items)) {
      const elementType = resolveType(items, { deps }).typeValue
      return `${elementType}[]`
    }
  }
}




function caseRef(
  schemaObject: OpenAPIV2.SchemaObject,
  {
    deps = Array<string>(0),
  } = {},
)  {
  const { $ref = '' } = schemaObject
  if ($ref) {
    const typeValue = getRefIdentifier($ref)
    deps.push(typeValue)
    return typeValue
  }
}




function caseString(
  schemaObject: OpenAPIV2.SchemaObject,
)  {
  const { type } = schemaObject
  if (typeof type === 'string') {
    if ([
      'string', 'byte', 'binary',
      'date', 'dateTime', 'password',
    ].includes(type)) {
      return 'string'
    }
  }
}

function caseFile(
  schemaObject: OpenAPIV2.SchemaObject,
)  {
  const { type } = schemaObject
  if (typeof type === 'string') {
    if (type === 'file') {
      return 'Blob'
    }
  }
}

function caseNumber(
  schemaObject: OpenAPIV2.SchemaObject,
)  {
  const { type, format } = schemaObject
  if (typeof type === 'string') {
    if ([
      'integer', 'float', 'number',
      'long', 'double',
    ].includes(type)) {
      if (format === 'int64') {
        return 'string'
      }
      return 'number'
    }
  }
}

function caseBoolean(
  schemaObject: OpenAPIV2.SchemaObject,
)  {
  const { type } = schemaObject
  if (typeof type === 'string') {
    if (type === 'boolean') {
      return 'boolean'
    }
  }
}

function caseUnion(
  schemaObject: OpenAPIV2.SchemaObject,
)  {
  const { type } = schemaObject
  if (Array.isArray(type)) {
    return type
      .map(e => resolveType({ type: e }).typeValue)
      .join(' | ')
  }
}

function caseAny(
  schemaObject: OpenAPIV2.SchemaObject,
)  {
  const { type } = schemaObject
  if (
    isNullish(type) ||
    type === 'any' 
  ) {
    return 'any'
  }
}




