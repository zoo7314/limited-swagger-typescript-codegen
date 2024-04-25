import { RequestConfigEntry } from "./types"
import * as objects from './objects'
import { ensureValidObjectAccessPath } from "./utils"

export function getApiRequestConfigEntries({
  api = objects.api({}),
}): RequestConfigEntry[] {
    const entries = Array<RequestConfigEntry>()
    entries.push(objects.requestConfigEntry({
      key: 'method',
      value: `'${api.method.toUpperCase()}'`,
    }))
    entries.push(objects.requestConfigEntry({
      key: 'url',
      value: settleApiUrl(api.url),
    }))
    const params = {
      all: api.parameters,
      path: api.parameters.filter(e => e.passIn === 'path'),
      notInPath: api.parameters.filter(e => e.passIn !== 'path'),
      query: api.parameters.filter(e => e.passIn === 'query'),
      body: api.parameters.filter(e => e.passIn === 'body' || e.passIn === 'formData'),
      headers: api.parameters.filter(e => e.passIn === 'header'),
    }
    if (!params.notInPath.length) {
      entries.push(objects.requestConfigEntry({
        key: '...config',
      }))
      return entries
    }
    if (params.query.length === params.notInPath.length) {
      entries.push(objects.requestConfigEntry({
        key: 'params',
        value: '',
      }))
    } else if (params.body.length === params.notInPath.length) {
      entries.push(objects.requestConfigEntry({
        key: 'data',
        value: 'params',
      }))
    } else if (params.headers.length === params.notInPath.length) {
      entries.push(objects.requestConfigEntry({
        key: 'headers',
        value: 'params',
      }))
    } else {
      if (params.query.length) {
        entries.push(objects.requestConfigEntry({
          key: 'params',
          entries: params.query.map(e => objects.requestConfigEntry({
            key: e.identifier,
            value: `params${ensureValidObjectAccessPath(e.identifier)}`,
          })),
        }))
      }
      if (params.body.length) {
        entries.push(objects.requestConfigEntry({
          key: 'data',
          entries: params.body.map(e => objects.requestConfigEntry({
            key: e.identifier,
            value: `params${ensureValidObjectAccessPath(e.identifier)}`,
          })),
        }))
      }
      if (params.headers.length) {
        entries.push(objects.requestConfigEntry({
          key: 'headers',
          entries: params.headers.map(e => objects.requestConfigEntry({
            key: e.identifier,
            value: `params${ensureValidObjectAccessPath(e.identifier)}`,
          })),
        }))
      }
    }
    if (api.sendFormData) {
      entries.push(objects.requestConfigEntry({
        key: 'transformRequest',
        value: '[transformParamsToFormData]',
      }))
    }
    entries.push(objects.requestConfigEntry({
      key: '...config',
    }))
    return entries
}





function settleApiUrl(url: string) {
  const reg = /\{(\w+)}/g
  const quoteChar = reg.test(url) ? '`' : '\''
  let ret = url.replace(reg, '$${params.$1}')
  ret = `${quoteChar}${ret}${quoteChar}`
  if (global.apiGenConfig.prefix) {
    ret = ret.replace(
      global.apiGenConfig.prefix,
      '',
    )
  }
  return ret
}


