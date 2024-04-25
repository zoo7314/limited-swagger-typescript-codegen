import { OpenAPIV2 } from "openapi-types"

export const oneOf = <T extends ReadonlyArray<any>>(...list: T) => list[0] as T[number]

export const openApiV2Doc = (): OpenAPIV2.Document => {
  return {
    swagger: '2.0',
    info: {
      title: 'DEFAULT_VALUES',
      version: '',
    },
    paths: {},
  }
}

export const operationObject = (): OpenAPIV2.OperationObject => {
  return {
    responses: {},
  }
}

export const schemaObject = (obj: OpenAPIV2.SchemaObject = {}) => obj


export const referenceObject = (): OpenAPIV2.ReferenceObject => ({ $ref: '' })

export const parameter = (): OpenAPIV2.Parameter => ({ name: '', type: '', in: '' })

export const tagObject = (): OpenAPIV2.TagObject => ({ name: '' })



