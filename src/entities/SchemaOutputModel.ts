import { ImportDecl } from "./ImportDecl";
import { ObjectSchema } from "./ObjectSchema";

type SchemaOutputModelCreateParams = ConstructorParameters<typeof SchemaOutputModel>[0]
export class SchemaOutputModel {

  schema: ObjectSchema
  imports: ImportDecl[]

  constructor({
    schema = ObjectSchema.create(),
    imports = Array<ImportDecl>(),
  }) {
    this.schema = schema
    this.imports = imports
  }

  static create(arg: SchemaOutputModelCreateParams = {}): SchemaOutputModel {
    return new this(arg)
  }


}




