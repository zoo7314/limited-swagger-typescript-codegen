import { OpenAPIV2 } from "openapi-types";

export function getSchemaBeforeResolveType(schema: OpenAPIV2.Schema): OpenAPIV2.Schema {
  const { rewriteInputTypeSchema } = global.apiGenConfig
  if (typeof rewriteInputTypeSchema === 'function') {
    const schemaNew = rewriteInputTypeSchema(schema)
    if (schemaNew) {
      return schemaNew
    } else {
      return schema
    }
  }
  return schema
}
