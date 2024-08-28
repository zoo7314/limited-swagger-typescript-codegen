import { getApi } from "./getApi"
import { getApiRequestConfigEntries } from "./getApiRequestConfigEntries"
import { objects } from "../objects"
import { RequestConfigEntry } from "../entities/RequestConfigEntry"

global.apiGenConfig = objects.genArgs()

const getEntries = ({
  path = '',
  opName = '',
  opObj = objects.operationObject(),
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
  opObj = objects.operationObject(),
}) => {
  return getEntries({ path, opName, opObj})
    .filter(e => (
      e.key !== 'method' &&
      e.key !== 'url' &&
      e.key !== 'sendFormData' &&
      e.key !== '...config'
    ))
}
const getFormDataEntry = (entries: RequestConfigEntry[]) =>
    entries.find(e => e.key === 'sendFormData')






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
      RequestConfigEntry.create({ key: 'params', value: '' }),
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
      RequestConfigEntry.create({ key: 'data', value: 'params' }),
    ])
    expect(getFormDataEntry(entries)).toBe(undefined)
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
      RequestConfigEntry.create({ key: 'data', value: 'params' }),
    ])
    expect(
      getFormDataEntry(entries),
    ).toEqual(
      RequestConfigEntry.create({
        key: 'sendFormData',
        value: 'true',
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
      RequestConfigEntry.create({ key: 'headers', value: 'params' }),
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
      RequestConfigEntry.create({ key: 'method', value: '\'POST\'' }),
      RequestConfigEntry.create({
        key: 'url',
        value: '`/user/${params.id}/list/${params.number}/detail`',
      }),
      RequestConfigEntry.create({
        key: 'params',
        entries: [
          RequestConfigEntry.create({ key: 'q1', value: 'params.q1' }),
          RequestConfigEntry.create({ key: 'q2', value: 'params.q2' }),
        ],
      }),
      RequestConfigEntry.create({
        key: 'data',
        entries: [
          RequestConfigEntry.create({ key: 'b1', value: 'params.b1' }),
          RequestConfigEntry.create({ key: 'b2', value: 'params.b2' }),
          RequestConfigEntry.create({ key: 'b3', value: 'params.b3' }),
        ],
      }),
      RequestConfigEntry.create({
        key: 'headers',
        entries: [
          RequestConfigEntry.create({ key: '\'h-1\'', value: 'params[\'h-1\']' }),
          RequestConfigEntry.create({ key: 'h2', value: 'params.h2' }),
        ],
      }),
      RequestConfigEntry.create({
        key: 'sendFormData',
        value: 'true',
      }),
      RequestConfigEntry.create({
        key: '...config',
      }),
    ])
  })










})





