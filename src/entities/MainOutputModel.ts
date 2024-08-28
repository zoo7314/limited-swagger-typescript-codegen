import { ImportDecl } from "./ImportDecl"
import { ServiceOutputModel } from "./ServiceOutputModel"

type MainOutputModelCreateParams = ConstructorParameters<typeof MainOutputModel>[0]
export class MainOutputModel {

  services: ServiceOutputModel[]
  imports: ImportDecl[]

  constructor({
    services = Array<ServiceOutputModel>(),
    imports = Array<ImportDecl>(),
  }) {
    this.services = services
    this.imports = imports
  }



  static create(arg: MainOutputModelCreateParams = {}): MainOutputModel {
    return new this(arg)
  }


}



