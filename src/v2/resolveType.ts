import { OpenAPIV2 } from "openapi-types"
import { isNullish, uniq } from "../utils"
import { getRefIdentifier } from "../normalizeIdentifier"
import { ResolvedType } from "../entities/ResolvedType"


export function resolveType(
  schemaObject: OpenAPIV2.SchemaObject,
): ResolvedType {

  let type: ResolvedType | undefined

  type ??= caseBoolean(schemaObject)
  type ??= caseNumber(schemaObject)
  type ??= caseString(schemaObject)
  type ??= caseFile(schemaObject)
  type ??= caseUnion(schemaObject)
  type ??= caseRef(schemaObject)
  type ??= caseArray(schemaObject)
  type ??= caseObject(schemaObject)
  type ??= caseAny(schemaObject)
  type ??= ResolvedType.any()

  return type
}



function caseObject(
  schemaObject: OpenAPIV2.SchemaObject,
) {
  const { type, items, additionalProperties } = schemaObject
  if (type === 'object') {
    let type: ResolvedType | undefined = undefined
    type = ResolvedType.object()
    if (
      additionalProperties &&
      typeof additionalProperties === 'object'
    ) {
      const recordSchema = additionalProperties as OpenAPIV2.SchemaObject
      const valueType = resolveType(recordSchema)
      type = ResolvedType.record(valueType)
    }
    return type
  }
}





function caseArray(
  schemaObject: OpenAPIV2.SchemaObject,
) {
  const { type, items } = schemaObject
  if (type === 'array') {
    if (!isNullish(items)) {
      const elementType = resolveType(items)
      return ResolvedType.arrayOf(elementType)
    }
  }
}




function caseRef(
  schemaObject: OpenAPIV2.SchemaObject,
)  {
  const { $ref = '' } = schemaObject
  if ($ref) {
    const symbol = getRefIdentifier($ref)
    return ResolvedType.typeSymbol(symbol)
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
      return ResolvedType.string()
    }
  }
}

function caseFile(
  schemaObject: OpenAPIV2.SchemaObject,
)  {
  const { type } = schemaObject
  if (typeof type === 'string') {
    if (type === 'file') {
      return ResolvedType.blob()
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
      return ResolvedType.number()
    }
  }
}

function caseBoolean(
  schemaObject: OpenAPIV2.SchemaObject,
)  {
  const { type } = schemaObject
  if (typeof type === 'string') {
    if (type === 'boolean') {
      return ResolvedType.boolean()
    }
  }
}

function caseUnion(
  schemaObject: OpenAPIV2.SchemaObject,
)  {
  const { type } = schemaObject
  if (Array.isArray(type)) {
    return ResolvedType.union(
      type.map(e => resolveType({ type: e })),
    )
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
    return ResolvedType.any()
  }
}




