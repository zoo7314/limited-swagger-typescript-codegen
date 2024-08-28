import { upperFirst } from "../utils"
import { Api } from "./Api"
import { ImportDecl } from "./ImportDecl"

type ServiceOutputModelCreateParams = ConstructorParameters<typeof ServiceOutputModel>[0]
export class ServiceOutputModel {

  tag: string
  name: string
  apis: Api[]
  imports: ImportDecl[]


  constructor({
    tag = '',
    name = '',
    apis = Array<Api>(),
    imports = Array<ImportDecl>(),
  }) {
    this.tag = tag
    this.name = name
    this.apis = apis
    this.imports = imports
  }

  get finalExportName(): string {
    return upperFirst(`${this.name}Service`)
  }


  static create(arg: ServiceOutputModelCreateParams = {}): ServiceOutputModel {
    return new this(arg)
  }





}

