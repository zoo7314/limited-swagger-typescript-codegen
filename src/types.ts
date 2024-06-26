import { OpenAPIV2 } from "openapi-types"

export type ResolvedType = {
  typeValue: string
  deps: string[]
}


export type ObjectSchema = {
  identifier: string
  properties: Property[]
  deps: string[]
}

export type Property = {
  identifier: string
  type: string
  description: string
  required: boolean
  deps: string[]
}

export type SchemaFileModel = {
  schema: ObjectSchema
  imports: ImportDecl[]
}

export type ImportDecl = {
  defaultExport: string
  namedExports: string[]
  module: string
  namespace: string
  get namedExportsJoined(): string
}

export type Api = {
  service: string
  identifier: string
  method: string
  url: string
  summary: string
  description: string
  parameters: ApiParameter[]
  sendFormData: boolean
  paramsType: string
  resType: string
  requestConfigEntries: RequestConfigEntry[]
  deps: string[]
  extracts: ObjectSchema[]
}

export type ApiParameter = Property & {
  passIn: string
}

export type RequestConfigEntry = {
  key: string
  value: string
  entries: RequestConfigEntry[]
}

export type ServiceFileModel = {
  name: string
  apis: Api[]
  imports: ImportDecl[]
}


export type MainFileModel = {
  services: ServiceFileModel[]
  imports: ImportDecl[]
}



export type ParseResult = {
  schemas: SchemaFileModel[]
  services: ServiceFileModel[]
  main: MainFileModel
}







export type GenConfig = {
  clientPath: string
  prefix: string
}

export type GenArgs = {
  input: string | OpenAPIV2.Document
  dest: string
  clientPath?: string
  prefix?: string
  rewriteInputTypeSchema?: (schema: OpenAPIV2.Schema)
    => OpenAPIV2.Schema | undefined
}








