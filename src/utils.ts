
export const valueOfType = <T>(value: T): T => value

export const isNullish = (value: any): value is (undefined | null) => value === undefined ||
  value === null

export const isFunction = (value: any): value is ((...args: any[]) => any) =>
  typeof value === 'function'

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


export const regParemterWithAccessPath = /^(\w+)(\[\d+]|\.)/
export const regIdentifierOddChars = /[«»\/\s-_]/g






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




