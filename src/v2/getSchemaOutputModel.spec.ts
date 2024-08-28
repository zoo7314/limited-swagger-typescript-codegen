import { objects } from '../objects'
import { getSchemaOutputModel } from './getSchemaOutputModel'

global.apiGenConfig = objects.genArgs()

const getImportIds = ({
  defName = '',
  defObj = objects.schemaObject()
}) => getSchemaOutputModel({ defName, defObj })
  .imports.map(e => e.namedItems[0])

describe('getSchemaFileModel', () => {

  it('does not import self ref', () => {
    const r = getImportIds({
      defName: "AreaItem",
      defObj: {
        "type": "object",
        "properties": {
          "children": {
            "type": "array",
            "items": {
              "$ref": "#/definitions/AreaItem"
            }
          },
        },
      },
    })
    expect(r).toEqual([])
  })

  it('handles dup ref imports', () => {
    const r = getImportIds({
      defName: "O",
      defObj: {
        "type": "object",
        "properties": {
          "prop1": {
            "type": "array",
            "items": {
              "$ref": "#/definitions/A"
            }
          },
          "prop2": {
            "type": "array",
            "items": {
              "$ref": "#/definitions/A"
            }
          },
          "prop3": {
            "type": "array",
            "items": {
              "$ref": "#/definitions/B"
            }
          },
        },
      },
    })
    expect(r.map(e => e.identifier)).toEqual(['A', 'B'])
    expect(r.map(e => e.isType)).toEqual([true, true])
  })

  it('quotes property odd identifier', () => {
    const r = getSchemaOutputModel({
      defName: "AreaItem",
      defObj: {
        "type": "object",
        "properties": {
          "Client-ID": {
            "type": "integer",
          },
        },
      },
    })
    expect(r.schema.properties[0].identifier).toBe('\'Client-ID\'')
  })


})



