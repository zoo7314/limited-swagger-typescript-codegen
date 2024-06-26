import { OpenAPIV2 } from "openapi-types"
import { schemaObject } from "../src/defaults"
import { resolveType } from "../src/resolveType"




let getType = (
  schemaObject: OpenAPIV2.SchemaObject,
) => resolveType(schemaObject).typeValue

let getDeps = (
  schemaObject: OpenAPIV2.SchemaObject,
) => resolveType(schemaObject).deps




describe('test typeValues', () => {

  it('recognizes numbers', () => {
    ['integer', 'float', 'long', 'double', 'number']
      .forEach(e => {
        expect(getType(schemaObject({ type: e }))).toBe('number')
      })
  })
  it('recognizes strings', () => {
    [
      'string', 'byte', 'binary',
      'date', 'dateTime', 'password',
    ]
      .forEach(e => {
        expect(getType(schemaObject({ type: e }))).toBe('string')
      })
  })
  it('recognizes files', () => {
    expect(getType(schemaObject({ type: 'file' }))).toBe('Blob')
  })
  it('recognizes booleans', () => {
    expect(getType(schemaObject({ type: 'boolean' }))).toBe('boolean')
  })
  it('recognizes to any', () => {
    expect(getType(schemaObject({ type: '' }))).toBe('any')
    expect(getType(schemaObject({ type: void (0) }))).toBe('any')
    expect(getType(schemaObject({ type: 'any' }))).toBe('any')
    expect(getType(schemaObject({ type: 'xxx' }))).toBe('any')
  })

  it('recognizes union of primitives', () => {
    expect(getType(schemaObject({ type: ['integer', 'date'] }))).toBe('number | string')
  })

  it('recognizes "object"', () => {
    expect(getType(schemaObject({ type: 'object' }))).toBe('object')
  })
  it('recognizes Record of primitives', () => {
    let schema = {
      type: 'object',
      additionalProperties: {
        type: 'integer'
      },
    }
    expect(getType(schema)).toBe('Record<string, number>')
  })
  it('recognizes Record of primitive arrays', () => {
    let schema = {
      type: 'object',
      additionalProperties: {
        type: 'array',
        items: {
          type: 'string'
        }
      },
    }
    expect(getType(schema)).toBe('Record<string, string[]>')
  })
  it('recognizes Record of ref arrays', () => {
    let schema = {
      type: 'object',
      additionalProperties: {
        type: 'array',
        items: {
          $ref: '#/definitions/DictItem',
        }
      },
    }
    expect(getType(schema)).toBe('Record<string, DictItem[]>')
  })

  it('recognizes primitive array', () => {
    let schema = {
      type: 'array',
      items: {
        type: 'double'
      }
    }
    expect(getType(schema)).toBe('number[]')
  })
  it('recognizes ref arrray', () => {
    let schema = {
      type: 'array',
      items: {
        $ref: '#/definitions/业务系统字典',
      },
    }
    expect(getType(schema)).toBe('YeWuXiTongZiDian[]')
  })

  it('recognizes normal ref', () => {
    let schema = {
      $ref: '#/definitions/AreaItem',
    }
    expect(getType(schema)).toBe('AreaItem')
  })
  it('recognizes CN ref', () => {
    let schema = {
      $ref: '#/definitions/业务系统字典',
    }
    expect(getType(schema)).toBe('YeWuXiTongZiDian')
  })
  it('recognizes "PageDTO"', () => {
    let schema = {
      $ref: '#/definitions/PageDTO«业务系统字典项»',
    }
    expect(getType(schema)).toBe('PageDTOYeWuXiTongZiDianXiang')
    schema = {
      $ref: '#/definitions/PageDTO«DictItem»',
    }
    expect(getType(schema)).toBe('PageDTODictItem')
  })

})



describe('test deps', () => {

  it('get empty deps when no ref', () => {
    let schema = {
      type: 'integer'
    }
    expect(getDeps(schema)).toEqual([])
  })
  it('get deps when normal ref', () => {
    let schema = {
      $ref: '#/definitions/AreaItem',
    }
    expect(getDeps(schema)).toEqual(['AreaItem'])
  })
  it('get deps when array of ref', () => {
    let schema = {
      type: 'array',
      items: {
        $ref: '#/definitions/AreaItem',
      },
    }
    expect(getDeps(schema)).toEqual(['AreaItem'])
  })
  it('get deps when Record of ref', () => {
    let schema = {
      type: 'object',
      additionalProperties: {
        $ref: '#/definitions/AreaItem',
      },
    }
    expect(getDeps(schema)).toEqual(['AreaItem'])
  })
  it('get deps when Record of ref arrays', () => {
    let schema = {
      type: 'object',
      additionalProperties: {
        type: 'array',
        items: {
          $ref: '#/definitions/DictItem',
        }
      },
    }
    expect(getDeps(schema)).toEqual(['DictItem'])
  })



})





