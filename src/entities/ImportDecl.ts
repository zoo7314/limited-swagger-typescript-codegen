type ImportDeclCreateParams = ConstructorParameters<typeof ImportDecl>[0]
export class ImportDecl {

  defaultItem: ImportDeclItem
  namedItems: ImportDeclItem[]
  module: string
  namespace: string

  constructor({
    defaultItem = ImportDeclItem.create(),
    namedItems = Array<ImportDeclItem>(),
    module = '',
    namespace = '',
  }) {
    this.defaultItem = defaultItem
    this.namedItems = namedItems
    this.module = module
    this.namespace = namespace
  }

  get namedItemsJoined(): string {
    return this.namedItems.map(e => {
      return e.isType
        ? `type ${e.identifier}`
        : e.identifier
    }).join(', ')
  }

  static create(arg: ImportDeclCreateParams = {}): ImportDecl {
    return new this(arg)
  }

}





type ImportDeclItemCreateParams = ConstructorParameters<typeof ImportDeclItem>[0]
export class ImportDeclItem {

  identifier: string
  isType: boolean

  constructor({
    identifier = '',
    isType = false,
  }) {
    this.identifier = identifier
    this.isType = isType
  }

  static create(arg: ImportDeclItemCreateParams = {}): ImportDeclItem {
    return new this(arg)
  }

}







