import { valueOfType } from "../utils";

type ResolvedTypeCreateParams = ConstructorParameters<typeof ResolvedType>[0];
export class ResolvedType {

  primitiveType: string
  referenceType: string
  typeSymbol: string
  typeArguments: ResolvedType[]
  arrayItemType: ResolvedType | null
  unionTypes: ResolvedType[]
  value: string
  symbolDeps: string[]
  depsExcludeSymbols: string[]

  constructor({
    primitiveType = '',
    referenceType = '',
    typeSymbol = '',
    typeArguments = Array<ResolvedType>(),
    arrayItemType = valueOfType<ResolvedType | null>(null),
    unionTypes = Array<ResolvedType>(),
    depsExcludeSymbols = Array<string>(),
  }) {
    this.primitiveType = primitiveType
    this.referenceType = referenceType
    this.typeSymbol = typeSymbol
    this.typeArguments = typeArguments
    this.arrayItemType = arrayItemType
    this.unionTypes = unionTypes
    this.depsExcludeSymbols = depsExcludeSymbols
    this.value = this.setValue()
    this.symbolDeps = this.setSymbolDeps()
  }

  get typeArgumentsValue(): string {
    if (this.typeArguments.length === 0) {
      return ''
    }
    const list = this.typeArguments.map(e => e.value).join(', ')
    return `<${list}>`
  }

  setValue(): string {
    if (this.primitiveType) {
      return this.primitiveType
    } else if (this.referenceType) {
      return this.referenceType
    } else if (this.typeSymbol) {
      return `${this.typeSymbol}${this.typeArgumentsValue}`
    } else if (this.arrayItemType) {
      return `${this.arrayItemType.value}[]`
    } else if (this.unionTypes.length) {
      return this.unionTypes.map(e => e.value).join(' | ')
    }
    return 'any'
  }

  setSymbolDeps(): string[] {
    let symbols: string[] = []
    if (this.typeSymbol && this.shouldCollectSymbol(this.typeSymbol)) {
      symbols.push(this.typeSymbol)
    }
    this.typeArguments.forEach(e => {
      e.symbolDeps.forEach(ee => {
        if (!symbols.includes(ee)) {
          symbols.push(ee)
        }
      })
    })
    if (this.arrayItemType) {
      this.arrayItemType.symbolDeps.forEach(ee => {
        if (!symbols.includes(ee)) {
          symbols.push(ee)
        }
      })
    }
    this.unionTypes.forEach(e => {
      e.symbolDeps.forEach(ee => {
        if (!symbols.includes(ee)) {
          symbols.push(ee)
        }
      })
    })
    symbols = symbols.filter(e => {
      return !this.depsExcludeSymbols.includes(e)
    })
    return symbols
  }






  static create(arg: ResolvedTypeCreateParams = {}): ResolvedType {
    return new this(arg)
  }

  static any() {
    return this.create()
  }

  static primitive(typeValue: string): ResolvedType {
    return this.create({
      primitiveType: typeValue,
    })
  }

  static string(): ResolvedType {
    return this.primitive('string')
  }

  static number(): ResolvedType {
    return this.primitive('number')
  }

  static boolean(): ResolvedType {
    return this.primitive('boolean')
  }

  static nullType(): ResolvedType {
    return this.primitive('null')
  }

  static undefinedType(): ResolvedType {
    return this.primitive('undefined')
  }

  static voidType(): ResolvedType {
    return this.primitive('void')
  }


  static typeSymbol(
    symbol: string,
    {
      typeArguments = Array<ResolvedType>(),
      depsExcludeSymbols = Array<string>(),
    } = {},
  ): ResolvedType {
    return this.create({
      typeSymbol: symbol,
      typeArguments,
      depsExcludeSymbols,
    })
  }

  static record(type: ResolvedType): ResolvedType {
    return this.typeSymbol(
      'Record',
      { typeArguments: [
        ResolvedType.string(),
        this.union([
          type,
          this.undefinedType(),
        ])
      ] },
    )
  }

  static map(key: ResolvedType, value: ResolvedType): ResolvedType {
    return this.typeSymbol(
      'Map',
      { typeArguments: [key, value] },
    )
  }

  static blob(): ResolvedType {
    return this.typeSymbol('Blob')
  }

  static object(): ResolvedType {
    return this.create({
      referenceType: 'object',
    })
  }

  static arrayOf(itemType: ResolvedType): ResolvedType {
    return this.create({
      arrayItemType: itemType,
    })
  }

  static union(types: ResolvedType[]): ResolvedType {
    return this.create({
      unionTypes: types,
    })
  }




  shouldCollectSymbol(symbol: string): boolean {
    return Boolean(symbol) && !symbolsBuiltin.includes(symbol)
  }



}


const symbolsBuiltin = [
  'Array',
  'Map',
  'Set',
  'Record',
  'Blob',
]

