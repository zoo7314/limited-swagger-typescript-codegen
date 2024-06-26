import { OpenAPIV2 } from "openapi-types"

type GenArgs = {
  /**
   * swagger json 对象
   * 或者是 能获取 json 的url
   */
  input: string | object
  /**
   * 输出目录
   */
  dest: string
  /**
   * client 文件的路径, client应为一个AxiosInstance
   */
  clientPath?: string
  /**
   * 接口 url 的固定起始路径, 最终生成的接口路径中会去掉
   */
  prefix?: string
  /**
   * 
   * 改写 swagger json 中的类型定义
   */
  rewriteInputTypeSchema?: (schema: OpenAPIV2.Schema)
    => OpenAPIV2.Schema
}
declare function gen(arg: GenArgs): Promise<void>;
export = gen

