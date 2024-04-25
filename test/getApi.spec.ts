import * as objects from '../src/objects'
import { getApi } from "../src/getApi"

global.apiGenConfig = objects.genConfig()

describe('getApi', () => {

  it('handles res type ref', () => {
    const api = getApi({
      path: '/x',
      opName: 'get',
      opObj: {
        "responses": {
          "200": { "description": "OK", "schema": { "$ref": "#/definitions/AreaItem" } },
        },
      },
    })
    expect(api.resType).toBe('AreaItem')
  })

  it('handles res type void', () => {
    const api = getApi({
      path: '/x',
      opName: 'get',
      opObj: {
        "responses": { "200": { "description": "OK", }, },
      },
    })
    expect(api.resType).toBe('void')
  })

  it('collects ref deps and dedup', () => {
    const api = getApi({
      path: '/x',
      opName: 'get',
      opObj: {
        "parameters": [
          { "in": "body", "name": "a", "schema": { "$ref": "#/definitions/A" } },
          { "in": "body", "name": "b", "schema": { "$ref": "#/definitions/B" } },
          { "in": "body", "name": "c", "schema": { "$ref": "#/definitions/A" } },
          { "in": "body", "name": "d", "schema": { "$ref": "#/definitions/C" } }
        ],
        "responses": {
          "200": { "description": "OK", "schema": { "$ref": "#/definitions/A" } },
        },
      },
    })
    expect(api.deps).toEqual(['A', 'B', 'C'])
  })

  it('handles 0 parameter', () => {
    const api = getApi({
      path: '/x',
      opName: 'x',
      opObj: {
        responses: {},
      },
    })
    expect(api.parameters.length).toBe(0)
  })

  it('handles parameter with access paths', () => {
    const api = getApi({
      path: '/x',
      opName: 'get',
      opObj: {
        "parameters": [
          { "in": "body", "name": "requestHeaders.acceptCharset[0].a", type: 'string'  },
          { "in": "body", "name": "requestHeaders.acceptCharset[0].b", type: 'string'  },
          { "in": "body", "name": "a", type: 'string' },
          { "in": "body", "name": "members[0].createBy", type: 'string'  },
          { "in": "body", "name": "members[0].createTime", type: 'string'  },
          { "in": "body", "name": "b", type: 'string' },
        ],
        "responses": {
          "200": { "description": "OK" },
        },
      },
    })
    const paramNames = api.parameters.map(e => e.identifier)
    expect(paramNames).toEqual(['requestHeaders', 'a', 'members', 'b'])
    expect(api.parameters.find(e => e.identifier === 'requestHeader')?.type === 'any')
    expect(api.parameters.find(e => e.identifier === 'members')?.type === 'any')
  })

  it('extracts parameter object', () => {
    const api = getApi({
      path: '/a',
      opName: 'get',
      opObj: {
        operationId: 'fetchThings',
        "parameters": [
          { "in": "body", "name": "a", type: 'string' },
          { "in": "body", "name": "b", type: 'string' },
          { "in": "body", "name": "c", type: 'string' },
        ],
        "responses": {
          "200": { "description": "OK" },
        },
      },
    })
    expect(api.extracts.length).toBe(1)
    expect(api.paramsType).toBe('FetchThingsParams')
    expect(api.extracts[0].identifier).toBe(api.paramsType)
    expect(api.extracts[0].properties).toEqual(api.parameters)
  })

  it('extracts parameter object when one param no ref', () => {
    const api = getApi({
      path: '/a',
      opName: 'get',
      opObj: {
        operationId: 'fetchThings',
        "parameters": [
          { "in": "body", "name": "a", type: 'string' },
        ],
        "responses": {
          "200": { "description": "OK" },
        },
      },
    })
    expect(api.extracts.length).toBe(1)
    expect(api.paramsType).toBe('FetchThingsParams')
    expect(api.extracts[0].identifier).toBe(api.paramsType)
    expect(api.extracts[0].properties).toEqual(api.parameters)
  })

  it('doesnt extracts parameter object when one param and it is not ref', () => {
    const api = getApi({
      path: '/x',
      opName: 'x',
      opObj: {
        operationId: 'fetchThings',
        "parameters": [
          { "in": "body", "name": "a", schema: { $ref: '#/definitions/A' } },
        ],
        "responses": {
          "200": { "description": "OK" },
        },
      },
    })
    expect(api.extracts.length).toBe(0)
    expect(api.paramsType).toBe('A')
  })








})


