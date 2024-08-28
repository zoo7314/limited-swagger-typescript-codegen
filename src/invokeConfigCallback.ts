import { isFunction } from "./utils"

export function invokeConfigCallback(callbackName: string, args?: any[]): any {
  const callback = (global.apiGenConfig as any)[callbackName]
  if (isFunction(callback)) {
    const ret = callback.apply(null, args ?? [])
    return ret
  }
}




