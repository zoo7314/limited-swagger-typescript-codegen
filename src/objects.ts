import * as defaults from "./defaults"
import { Api, ApiParameter, GenArgs, GenConfig, ImportDecl, MainFileModel, ObjectSchema, ParseResult, Property, RequestConfigEntry, ResolvedType, SchemaFileModel, ServiceFileModel } from "./types"


export const resolvedType = ({
  typeValue = '',
  deps = Array<string>(0),
} = {}): ResolvedType => ({
  typeValue,
  deps,
})

export const objectSchema = ({
  identifier = '',
  properties = Array<Property>(0),
  deps = Array<string>(0),
} = {}): ObjectSchema => ({
  identifier,
  properties,
  deps,
})

export const property = ({
  identifier = '',
  type = '',
  description = '',
  required = false,
  deps = Array<string>(0),
} = {}): Property => ({
  identifier,
  type,
  description,
  required,
  deps,
})

export const schemaFileModel = ({
  schema = objectSchema(),
  imports = Array<ImportDecl>(0),
} = {}): SchemaFileModel => ({
  schema,
  imports,
})

export const importDecl = ({
  defaultExport = '',
  namedExports = Array<string>(),
  module = '',
  namespace = '',
} = {}): ImportDecl => ({
  defaultExport,
  namedExports,
  module,
  namespace,
  get namedExportsJoined() {
    return this.namedExports.join(', ')
  },
})

export const api = ({
  service = '',
  identifier = '',
  method= '',
  url = '',
  summary = '',
  description = '',
  parameters = Array<ApiParameter>(0),
  paramsType = '',
  sendFormData = false,
  resType = '',
  requestConfigEntries = Array<RequestConfigEntry>(0),
  deps = Array<string>(0),
  extracts = Array<ObjectSchema>(0),
} = {}): Api => ({
  service,
  identifier,
  method,
  url,
  summary,
  description,
  parameters,
  sendFormData,
  paramsType,
  resType,
  requestConfigEntries,
  deps,
  extracts,
})


export const apiParameter = ({
  identifier = '',
  type = '',
  description = '',
  required = false,
  deps = Array<string>(0),
  passIn = '',
} = {}): ApiParameter => ({
  ...property({
    identifier,
    type,
    description,
    required,
    deps,
  }),
  passIn,
})

export const requestConfigEntry = ({
  key = '',
  value = '',
  entries = Array<RequestConfigEntry>(),
} = {}): RequestConfigEntry => ({
  key,
  value,
  entries,
})


export const serviceFileModel = ({
  name = '',
  apis = Array<Api>(0),
  imports = Array<ImportDecl>(0),
} = {}): ServiceFileModel => ({
  name,
  apis,
  imports,
})

export const mainFileModel = ({
  services = Array<ServiceFileModel>(),
  imports = Array<ImportDecl>(),
} = {}): MainFileModel => ({
  services,
  imports,
})


export const parseResult = ({
  schemas = Array<SchemaFileModel>(0),
  services = Array<ServiceFileModel>(0),
  main = mainFileModel(),
} = {}): ParseResult => ({
  schemas,
  services,
  main,
})



export const genConfig = ({
  clientPath = '@/client',
  prefix = '',
} = {}): GenConfig => ({
  clientPath,
  prefix,
})

export const genArgs = ({
  input = '',
  dest = '',
  clientPath = '@/client',
  prefix = '',
} = {}): GenArgs => ({
  input,
  dest,
  clientPath,
  prefix,
})




