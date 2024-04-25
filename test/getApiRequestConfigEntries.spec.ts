import * as objects from '../src/objects'
import * as defaults from '../src/defaults'
import { getApi } from "../src/getApi"
import { getApiRequestConfigEntries } from "../src/getApiRequestConfigEntries"
import { RequestConfigEntry } from '../src/types'

global.apiGenConfig = objects.genConfig()

const getEntries = ({
  path = '',
  opName = '',
  opObj = defaults.operationObject(),
}) => {
  return getApiRequestConfigEntries({
    api: getApi({
      path,
      opName,
      opObj,
    })
  })
}
const getUrlEntry = (entries: RequestConfigEntry[]) =>
    entries.find(e => e.key === 'url')
const getParamsNotPath = ({
  path = '',
  opName = '',
  opObj = defaults.operationObject(),
}) => {
  return getEntries({ path, opName, opObj})
    .filter(e => (
      e.key !== 'method' &&
      e.key !== 'url' &&
      e.key !== 'transformRequest' &&
      e.key !== '...config'
    ))
}
const getTransformRequestEntry = (entries: RequestConfigEntry[]) =>
    entries.find(e => e.key === 'transformRequest')






describe('getApiRequestConfigEntries params', () => {


  test('no params', () => {
    const arg = {
      path: '/path/of/api',
      opName: 'get',
      opObj: { responses: {}, },
    }
    const entries = getEntries(arg)
    const params = getParamsNotPath(arg)
    expect(params.length).toBe(0)
    expect(getUrlEntry(entries)?.value).toBe('\'/path/of/api\'')
  })

  test('only path params', () => {
    const arg = {
      path: '/x/{id}/{number}',
      opName: 'get',
      opObj: { responses: {}, },
    }
    const entries = getEntries(arg)
    const params = getParamsNotPath(arg)
    expect(params.length).toBe(0)
    expect(getUrlEntry(entries)?.value).toBe('`/x/${params.id}/${params.number}`')
  })

  test('only query params', () => {
    const arg = {
      path: '/x',
      opName: 'get',
      opObj: {
        parameters: [
          { name: 'a', in: 'query', type: '' },
          { name: 'b', in: 'query', type: '' },
        ],
        responses: {},
      },
    }
    const params = getParamsNotPath(arg)
    expect(params).toEqual([
      objects.requestConfigEntry({ key: 'params', value: '' }),
    ])
  })

  test('only body params', () => {
    const arg = {
      path: '/x',
      opName: 'post',
      opObj: {
        parameters: [
          { name: 'a', in: 'body', type: '' },
          { name: 'b', in: 'body', type: '' },
        ],
        responses: {},
      },
    }
    const entries = getEntries(arg)
    const params = getParamsNotPath(arg)
    expect(params).toEqual([
      objects.requestConfigEntry({ key: 'data', value: 'params' }),
    ])
    expect(getTransformRequestEntry(entries)).toBe(undefined)
  })

  test('body and formData params', () => {
    const arg = {
      path: '/x',
      opName: 'post',
      opObj: {
        parameters: [
          { name: 'a', in: 'body', type: '' },
          { name: 'b', in: 'formData', type: '' },
          { name: 'c', in: 'body', type: '' },
        ],
        responses: {},
      },
    }
    const entries = getEntries(arg)
    const params = getParamsNotPath(arg)
    expect(params).toEqual([
      objects.requestConfigEntry({ key: 'data', value: 'params' }),
    ])
    expect(getTransformRequestEntry(entries)).toEqual(
      objects.requestConfigEntry({
        key: 'transformRequest',
        value: '[transformParamsToFormData]',
      })
    )
  })

  test('only headers params', () => {
    const arg = {
      path: '/x',
      opName: 'post',
      opObj: {
        parameters: [
          { name: 'a', in: 'header', type: '' },
          { name: 'b', in: 'header', type: '' },
        ],
        responses: {},
      },
    }
    const params = getParamsNotPath(arg)
    expect(params).toEqual([
      objects.requestConfigEntry({ key: 'headers', value: 'params' }),
    ])
  })

  test('all kinds of params', () => {
    const arg = {
      path: '/user/{id}/list/{number}/detail',
      opName: 'post',
      opObj: {
        parameters: [
          { name: 'id', in: 'path', type: '' },
          { name: 'number', in: 'path', type: '' },
          { name: 'q1', in: 'query', type: '' },
          { name: 'q2', in: 'query', type: '' },
          { name: 'b1', in: 'body', type: '' },
          { name: 'b2', in: 'body', type: '' },
          { name: 'b3', in: 'formData', type: '' },
          { name: 'h-1', in: 'header', type: '' },
          { name: 'h2', in: 'header', type: '' },
        ],
        responses: {},
      },
    }
    const entries = getEntries(arg)
    expect(entries).toEqual([
      objects.requestConfigEntry({ key: 'method', value: '\'POST\'' }),
      objects.requestConfigEntry({
        key: 'url',
        value: '`/user/${params.id}/list/${params.number}/detail`',
      }),
      objects.requestConfigEntry({
        key: 'params',
        entries: [
          objects.requestConfigEntry({ key: 'q1', value: 'params.q1' }),
          objects.requestConfigEntry({ key: 'q2', value: 'params.q2' }),
        ],
      }),
      objects.requestConfigEntry({
        key: 'data',
        entries: [
          objects.requestConfigEntry({ key: 'b1', value: 'params.b1' }),
          objects.requestConfigEntry({ key: 'b2', value: 'params.b2' }),
          objects.requestConfigEntry({ key: 'b3', value: 'params.b3' }),
        ],
      }),
      objects.requestConfigEntry({
        key: 'headers',
        entries: [
          objects.requestConfigEntry({ key: '\'h-1\'', value: 'params[\'h-1\']' }),
          objects.requestConfigEntry({ key: 'h2', value: 'params.h2' }),
        ],
      }),
      objects.requestConfigEntry({
        key: 'transformRequest',
        value: '[transformParamsToFormData]',
      }),
      objects.requestConfigEntry({
        key: '...config',
      }),
    ])
  })










})





