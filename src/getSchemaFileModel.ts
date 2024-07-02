import { ObjectSchema, Property, SchemaFileModel } from "./types"
import * as defaults from './defaults'
import * as objects from './objects'
import { normalizeIdentifier } from "./normalizeIdentifier"
import { resolveType } from "./resolveType"
import { ensureValidObjectKey, uniq } from "./utils"
import { getSchemaBeforeResolveType } from "./getSchemaBeforeResolveType"

global.apiGenConfig = objects.genArgs()

export function getSchemaFileModel({
  defName = '',
  defObj = defaults.schemaObject(),
}): SchemaFileModel {
  const schemaFileModel = objects.schemaFileModel()
  schemaFileModel.schema = getObjectSchema({ defName, defObj })
  schemaFileModel.imports = uniq(schemaFileModel.schema.deps)
    .map(dep => objects.importDecl({
      namedExports: [`type ${dep}`],
      module: `./${dep}`,
    }))
  return schemaFileModel
}


function getObjectSchema({
  defName = '',
  defObj = defaults.schemaObject(),
}): ObjectSchema {
  const objectSchema = objects.objectSchema({
    identifier: normalizeIdentifier(defName),
  })
  const { properties = {} } = defObj
  objectSchema.properties = Object.entries(properties)
    .map(([propName, propSchema]) => getProperty({
      propName,
      propSchema,
      defObj,
      objectSchema,
    }))
  return objectSchema
}





function getProperty({
  propName = '',
  propSchema = defaults.schemaObject(),
  defObj = defaults.schemaObject(),
  objectSchema = objects.objectSchema(),
}): Property {
  const { required = [] } = defObj
  const { typeValue, deps } = resolveType(getSchemaBeforeResolveType(propSchema))
  addObjectSchemaDeps(objectSchema, deps)
  return objects.property({
    identifier: ensureValidObjectKey(propName),
    description: propSchema.description ?? '',
    required: required.includes(propName),
    type: typeValue,
    deps,
  })
}



export function addObjectSchemaDeps(schema: ObjectSchema, deps: string[]) {
  for (const dep of deps) {
    if (
      dep &&
      schema.identifier !== dep &&
      !schema.deps.find(e => e === dep)
    ) {
      schema.deps.push(dep)
    }
  }
}












