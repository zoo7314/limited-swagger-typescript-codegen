import { Property } from "./Property"

type ObjectSchemaCreateParams = ConstructorParameters<typeof ObjectSchema>[0]
export class ObjectSchema {

  identifier: string
  properties: Property[]

  constructor({
    identifier = '',
    properties = Array<Property>(),
  }) {
    this.identifier = identifier
    this.properties = properties
  }

  static create(arg: ObjectSchemaCreateParams = {}): ObjectSchema {
    return new this(arg)
  }

}


