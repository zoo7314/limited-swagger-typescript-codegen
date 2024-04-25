import { includesCN, normalizeCN, pascalCase, regIdentifierOddChars } from "./utils"

export function normalizeIdentifier(str: string) {
  str = cleanIdentifierOddness(str)
  str = pascalCase(str)
  return str
}


export function cleanIdentifierOddness(str: string) {
  str = str.replace(regIdentifierOddChars, '')
  if (includesCN(str)) {
    str = normalizeCN(str)
  }
  return str
}


export function getRefIdentifier(ref: string) {
  const reg = /#\/definitions\/(.+)$/
  let identifier = ref.match(reg)?.[1] ?? ''
  identifier = normalizeIdentifier(identifier)
  return identifier
}



