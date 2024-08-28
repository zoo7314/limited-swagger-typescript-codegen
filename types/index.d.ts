type GenArgs = {
  /**
   * swagger json object
   * or url that fetches it
   */
  input: string | object
  /**
   * output directory
   */
  output: string
  /**
   * path of client.ts
   */
  clientPath?: string
  /**
   * url prefix
   */
  prefix?: string
  preset?: (config: GenArgs) => void
  apiNamingMethod?: (api: any) => any
  eachInputTypeSchemaObject?: (schema: any) => any
  eachApi?: (arg: any) => any
  afterOutput?: () => any
}
declare function gen(config: GenArgs): Promise<void>;
declare function nameApiWithUrlAndMethod(api: any): any;

declare function workplacePreset(config: GenArgs): void

export {
  gen,
  nameApiWithUrlAndMethod,
  workplacePreset,
}

