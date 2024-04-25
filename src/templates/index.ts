import schema from './schema.hbs'
import service from './service.hbs'
import main from './main.hbs'
import objectSchema from './partials/objectSchema.hbs'
import api from './partials/api.hbs'
import requestConfigEntry from './partials/requestConfigEntry.hbs' 
import importDecl from './partials/importDecl.hbs'

export default {
  schema,
  service,
  main,
  partials: {
    objectSchema,
    api,
    requestConfigEntry,
    importDecl,
  },
}



