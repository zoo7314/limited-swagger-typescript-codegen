import * as defaults from '../src/defaults'
import { getSchemaFileModel } from "../src/getSchemaFileModel"

const getImportIds = ({
  defName = '',
  defObj = defaults.schemaObject(),
}) => getSchemaFileModel({ defName, defObj })
  .imports.map(e => e.namedExports[0])

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
    expect(r).toEqual(['type A', 'type B'])
  })

  it('quotes property odd identifier', () => {
    const r = getSchemaFileModel({
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
    expect(r.schema.properties[0].identifier).toEqual('\'Client-ID\'')
  })


})



