import { Api } from '../entities/Api'
import { RequestConfigEntry } from '../entities/RequestConfigEntry'
import { ensureValidObjectAccessPath } from "../utils"

export function getApiRequestConfigEntries({
  api = Api.create(),
}): RequestConfigEntry[] {
    const entries = Array<RequestConfigEntry>()
    entries.push(RequestConfigEntry.create({
      key: 'method',
      value: `'${api.method.toUpperCase()}'`,
    }))
    entries.push(RequestConfigEntry.create({
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
      entries.push(RequestConfigEntry.create({
        key: '...config',
      }))
      return entries
    }
    if (params.query.length === params.notInPath.length) {
      entries.push(RequestConfigEntry.create({
        key: 'params',
        value: '',
      }))
    } else if (params.body.length === params.notInPath.length) {
      entries.push(RequestConfigEntry.create({
        key: 'data',
        value: 'params',
      }))
    } else if (params.headers.length === params.notInPath.length) {
      entries.push(RequestConfigEntry.create({
        key: 'headers',
        value: 'params',
      }))
    } else {
      if (params.query.length) {
        entries.push(RequestConfigEntry.create({
          key: 'params',
          entries: params.query.map(e => RequestConfigEntry.create({
            key: e.identifier,
            value: `params${ensureValidObjectAccessPath(e.identifier)}`,
          })),
        }))
      }
      if (params.body.length) {
        entries.push(RequestConfigEntry.create({
          key: 'data',
          entries: params.body.map(e => RequestConfigEntry.create({
            key: e.identifier,
            value: `params${ensureValidObjectAccessPath(e.identifier)}`,
          })),
        }))
      }
      if (params.headers.length) {
        entries.push(RequestConfigEntry.create({
          key: 'headers',
          entries: params.headers.map(e => RequestConfigEntry.create({
            key: e.identifier,
            value: `params${ensureValidObjectAccessPath(e.identifier)}`,
          })),
        }))
      }
    }
    if (api.sendFormData) {
      entries.push(RequestConfigEntry.create({
        key: 'sendFormData',
        value: 'true',
      }))
    }
    entries.push(RequestConfigEntry.create({
      key: '...config',
    }))
    return entries
}





function settleApiUrl(url: string) {
  const reg = /\{(\w+)}/g
  const quoteChar = reg.test(url) ? '`' : '\''
  let ret = url.replace(reg, '$${params.$1}')
  ret = `${quoteChar}${ret}${quoteChar}`
  return ret
}


