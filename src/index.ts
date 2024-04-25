import axios from 'axios'
import * as defaults from './defaults'
import * as objects from './objects'
import { output } from './output'
import parse from './parse'
import { OpenAPIV2 } from 'openapi-types'


async function gen({
  input = defaults.oneOf('', defaults.openApiV2Doc()),
  dest = '',
  config = objects.genConfig(),
}): Promise<void> {
  global.apiGenConfig = config
  let inputFinal = defaults.openApiV2Doc()
  if (typeof input === 'string') {
    inputFinal = await fetchRemoteDocInput(input)
  } else {
    inputFinal = input
  }
  const result = parse({ input: inputFinal })
  await output({ result, dest })
}


async function fetchRemoteDocInput(url: string) {
  return await axios.get<OpenAPIV2.Document>(url)
    .then(response => response.data)
}





export default gen







