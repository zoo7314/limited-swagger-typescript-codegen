import { MainOutputModel } from "./MainOutputModel"
import { SchemaOutputModel } from "./SchemaOutputModel"
import { ServiceOutputModel } from "./ServiceOutputModel"

type ParseResultCreateParams = ConstructorParameters<typeof ParseResult>[0]
export class ParseResult {

  schemas: SchemaOutputModel[]
  services: ServiceOutputModel[]
  main: MainOutputModel

  constructor({
    schemas = Array<SchemaOutputModel>(),
    services = Array<ServiceOutputModel>(),
    main = MainOutputModel.create(),
  }) {
    this.schemas = schemas
    this.services = services
    this.main = main
  }

  static create(arg: ParseResultCreateParams = {}): ParseResult{
    return new this(arg)
  }


}




