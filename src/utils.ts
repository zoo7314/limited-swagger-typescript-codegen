import { pinyin } from "pinyin-pro"
import { Api } from "./types"

export const isNullish = (value: any): value is (undefined | null) => value === undefined ||
  value === null

export const ifElement = <T>(
  truth: boolean,
  element: T,
  elementElse?: T,
): T[] => (
  truth
    ? [element]
    : (
      isNullish(elementElse) ? [] : [elementElse]
    )
)

export const assign = <T extends {}>(obj: T, data: Partial<T>): void => {
  Object.assign(obj, data)
}

export const upperFirst = (str: string | number | symbol) => {
  str = String(str)
  return str
    ? `${str[0].toUpperCase()}${str.slice(1)}`
    : ''
}

export const camelCase = (str: string) => {
  return str.split(/\W/).map((s, i) => {
    if (i === 0) return s 
    return s.length
      ? `${s[0].toUpperCase()}${s.slice(1)}`
      : ''
  }).join('')
}

export const pascalCase = (str: string) => upperFirst(camelCase(str))


const regCN = /[\u4e00-\u9fa5|\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]+/g
const regCNPuncs = /[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/g
export const regParemterWithAccessPath = /^(\w+)(\[\d+]|\.)/
export const regIdentifierOddChars = /[«»\/\s-]/g

export const includesCN = (str: string) => regCN.test(str)


export const cleanCNPuncs = (str: string) => {
  str = str.replace(regCNPuncs, '')
  return str
}

export const normalizeCN = (str: string) => {
  str = cleanCNPuncs(str)
  str = str.replace(regCN, (match) => {
    let replacement = pinyin(match, {
      toneType: 'none',
      v: true,
    })
    replacement = ' ' + replacement + ' '
    return replacement
  })
  str = str.trim()
  return str
}


export const uniqBy = <T extends Record<string, any>>(array: T[], key: string) => {
  return array.filter((item, index) => {
    return array.findIndex(e => e[key] === item[key])
      === index
  })
}

export const uniq = <T>(array: T[]) => {
  return array.filter((item, index) => {
    return array.indexOf(item) === index
  })
}




export function addApiDeps(api: Api, deps: string[]) {
  for (const dep of deps) {
    if (
      dep &&
      !api.deps.find(e => e === dep)
    ) {
      api.deps.push(dep)
    }
  }
}

export function ensureValidObjectKey(key: string) {
  const regNotValid = /[-/.\[\]]/
  if (regNotValid.test(key)) {
    return `'${key}'`
  }
  return key
}

export function ensureValidObjectAccessPath(str: string) {
  const regNotValid = /[-/.\[\]]/
  if (regNotValid.test(str)) {
    return `[${str}]`
  }
  return `.${str}`
}




