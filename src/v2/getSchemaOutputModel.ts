import { normalizeIdentifier } from "../normalizeIdentifier"
import { resolveType } from "./resolveType"
import { ensureValidObjectKey, uniq } from "../utils"
import { objects } from "../objects"
import { SchemaOutputModel } from "../entities/SchemaOutputModel"
import { ObjectSchema } from '../entities/ObjectSchema'
import { Property } from '../entities/Property'
import { ImportDecl, ImportDeclItem } from "../entities/ImportDecl"
import { invokeConfigCallback } from "../invokeConfigCallback"
import { ConfigCallbacks } from "../types"


export function getSchemaOutputModel({
  defName = '',
  defObj = objects.schemaObject(),
}): SchemaOutputModel {
  const schemaOutputModel = SchemaOutputModel.create()
  schemaOutputModel.schema = getObjectSchema({ defName, defObj })
  schemaOutputModel.imports = getImports({ schema: schemaOutputModel.schema })
  return schemaOutputModel
}


function getObjectSchema({
  defName = '',
  defObj = objects.schemaObject(),
}): ObjectSchema {
  const objectSchema = ObjectSchema.create({
    identifier: normalizeIdentifier(defName),
  })
  const { properties = {} } = defObj
  objectSchema.properties = Object.entries(properties)
    .map(([propName, propSchema]) => getProperty({
      propName,
      propSchema,
      defObj,
    }))
  return objectSchema
}





function getProperty({
  propName = '',
  propSchema = objects.schemaObject(),
  defObj = objects.schemaObject(),
}): Property {
  const { required = [] } = defObj
  invokeConfigCallback(ConfigCallbacks.eachInputTypeSchemaObject, [propSchema])
  const type = resolveType(propSchema)
  return Property.create({
    identifier: ensureValidObjectKey(propName),
    description: propSchema.description ?? '',
    required: required.includes(propName),
    type,
  })
}



function getImports({
  schema = ObjectSchema.create(),
}): ImportDecl[] {
  const all = uniq(
    schema.properties.flatMap(property => {
      return property.type.symbolDeps
        .filter(e => e !== schema.identifier)
    }),
  )
  const imports = all.map(identifier => {
    return ImportDecl.create({
      namedItems: [
        ImportDeclItem.create({
          identifier,
          isType: true,
        }),
      ],
      module: `./${identifier}`
    })
  })
  return imports
}
















