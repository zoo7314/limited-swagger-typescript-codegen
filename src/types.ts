import { OpenAPIV2, OpenAPIV3, OpenAPIV3_1 } from "openapi-types"


type OpenApiDoc =
  | OpenAPIV2.Document
  | OpenAPIV3.Document
  | OpenAPIV3_1.Document

export const openApiV2Doc = (
  obj: OpenAPIV2.Document = {
    swagger: '',
    info: {
      title: '',
      version: '',
    },
    paths: {},
  },
): OpenAPIV2.Document => {
  return {
    ...obj,
    swagger: '2.0',
  }
}
export const isOpenApiV2Doc = (obj: OpenApiDoc): obj is OpenAPIV2.Document => {
  return (obj as any).swagger === '2.0'
}

export const openApiV3Doc = (
  obj: OpenAPIV3.Document = {
    openapi: '',
    info: {
      title: '',
      version: '',
    },
    paths: {},
  },
): OpenAPIV3.Document => {
  return {
    ...obj,
    openapi: '3.0.0',
  }
}

export const openApiV3_1Doc = (
  obj: OpenAPIV3_1.Document = {
    openapi: '',
    info: {
      title: '',
      version: '',
    },
    paths: {},
  },
): OpenAPIV3_1.Document => {
  return {
    ...obj,
    openapi: '3.0.1',
  }
}

export const openApiDoc = (
  obj: OpenApiDoc = openApiV2Doc(),
): OpenApiDoc => {
  return obj
}




export const operationObject = (): OpenAPIV2.OperationObject => {
  return {
    responses: {},
  }
}

export const referenceObject = (): OpenAPIV2.ReferenceObject => ({ $ref: '' })

export const parameterObject = (): OpenAPIV2.Parameter => ({ name: '', type: '', in: '' })

export const tagObject = (): OpenAPIV2.TagObject => ({ name: '' })

export const schemaObject = (obj: OpenAPIV2.SchemaObject = {}) => obj





export type GenArgs = {
  input: string | OpenApiDoc
  output: string
  clientPath?: string
  prefix?: string
  preset?: (config: GenArgs) => void
  apiNamingMethod?: (api: any) => any
  eachInputTypeSchemaObject?: (schema: any) => any
  eachApi?: (arg: any) => any
  beforeOutput?: (arg: any) => any
  afterOutput?: () => any
}

export const genArgs = ({
  input = '',
  output = '',
  clientPath = '@/client',
} = {}) => {
  return {
    input,
    output,
    clientPath,
  }
}

export const ConfigCallbacks = {
  preset: 'preset',
  apiNamingMethod: 'apiNamingMethod',
  eachInputTypeSchemaObject: 'eachInputTypeSchemaObject',
  eachApi: 'eachApi',
  beforeOutput: 'beforeOutput',
  afterOutput: 'afterOutput',
}











