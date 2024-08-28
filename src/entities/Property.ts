import { ResolvedType } from "./ResolvedType"

type PropertyCreateParams = ConstructorParameters<typeof Property>[0]
export class Property {

  identifier: string
  description: string
  type: ResolvedType
  required: boolean

  constructor({
    identifier = '',
    description = '',
    type = ResolvedType.create(),
    required = false,
  }) {
    this.identifier = identifier
    this.description = description
    this.type = type
    this.required = required
  }

  static create(arg: PropertyCreateParams = {}): Property {
    return new this(arg)
  }





}


