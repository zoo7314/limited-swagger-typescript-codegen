type RequestConfigEntryCreateParams = ConstructorParameters<typeof RequestConfigEntry>[0]
export class RequestConfigEntry {

  key: string
  value: string
  entries: RequestConfigEntry[]

  constructor({
    key = '',
    value = '',
    entries = Array<RequestConfigEntry>(),
  }) {
    this.key = key
    this.value = value
    this.entries = entries
  }

  static create(arg: RequestConfigEntryCreateParams = {}): RequestConfigEntry {
    return new this(arg)
  }



}