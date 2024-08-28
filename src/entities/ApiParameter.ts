import { Property } from "./Property"
import { ResolvedType } from "./ResolvedType"

type ApiParameterCreateParams = ConstructorParameters<typeof ApiParameter>[0]
export class ApiParameter extends Property {

  passIn: string

  constructor({
    identifier = '',
    description = '',
    type = ResolvedType.create(),
    required = false,
    passIn = '',
  }) {
    super({
      identifier,
      description,
      type,
      required,
    })
    this.passIn = passIn
  }
  

  static create(arg: ApiParameterCreateParams = {}): ApiParameter {
    return new this(arg)
  }


}
