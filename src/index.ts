import { output } from './output'
import { ConfigCallbacks, GenArgs } from './types'
import { objects } from './objects'
import parse from './v2/parse'
import { ParseResult } from './entities/ParseResult'
import { invokeConfigCallback } from './invokeConfigCallback'


async function gen(config: GenArgs): Promise<void> {
  global.apiGenConfig = config
  invokeConfigCallback(ConfigCallbacks.preset, [config])
  const {
    input,
    output: dest,
  } = config
  let inputFinal = objects.openApiDoc()
  if (typeof input === 'string') {
    inputFinal = await fetchRemoteDocInput(input)
  } else {
    inputFinal = input
  }
  let result = ParseResult.create()
  if (objects.isOpenApiV2Doc(inputFinal)) {
    result = parse({ input: inputFinal })
  }
  invokeConfigCallback(ConfigCallbacks.beforeOutput, [result])
  await output({ result, dest })
  invokeConfigCallback(ConfigCallbacks.afterOutput)
}


async function fetchRemoteDocInput(url: string) {
  const res = await fetch(url)
  const json = await res.json()
  return json
}


export {
  gen,
}

export { nameApiWithUrlAndMethod } from './nameApiWithUrlAndMethod'
export * from './workplacePreset'




