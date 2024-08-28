import { uniq } from "../utils"
import { ApiParameter } from "./ApiParameter"
import { ObjectSchema } from "./ObjectSchema"
import { RequestConfigEntry } from "./RequestConfigEntry"
import { ResolvedType } from "./ResolvedType"

type ApiCreateParams = ConstructorParameters<typeof Api>[0]
export class Api {

  service: string
  operationId: string
  identifier: string
  method: string
  url: string
  summary: string
  description: string
  parameters: ApiParameter[]
  paramsType: ResolvedType
  resType: ResolvedType
  requestConfigEntries: RequestConfigEntry[]
  extracts: ObjectSchema[]

  constructor({
    service = '',
    identifier = '',
    operationId = '',
    method = '',
    url = '',
    summary = '',
    description = '',
    parameters = Array<ApiParameter>(),
    paramsType = ResolvedType.create(),
    resType = ResolvedType.create(),
    requestConfigEntries = Array<RequestConfigEntry>(),
    extracts = Array<ObjectSchema>(),
  }) {
    this.service = service
    this.identifier = identifier
    this.operationId = operationId
    this.method = method
    this.url = url
    this.summary = summary
    this.description = description
    this.parameters = parameters
    this.paramsType = paramsType
    this.resType = resType
    this.requestConfigEntries = requestConfigEntries
    this.extracts = extracts
  }

  get sendFormData(): boolean {
    return this.parameters.some(e => e.passIn === 'formData')
  }

  get typeSymbolDeps(): string[] {
    const deps = this.parameters.flatMap(param => {
      return param.type.symbolDeps
    })
      .concat(this.paramsType.symbolDeps)
      .concat(this.resType.symbolDeps)
    return uniq(deps)
  }

  static create(arg: ApiCreateParams = {}): Api {
    return new this(arg)
  }




}



