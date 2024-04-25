type GenArg = {
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
   * 生成选项
   */
  config?: {
    /**
     * client 文件的路径, client应为一个AxiosInstance
     */
    clientPath: string
    /**
     * 接口 url 的固定起始路径, 最终生成的接口路径中会去掉
     */
    prefix: string
  }
}
declare function gen(arg: GenArg): Promise<void>;
export = gen

