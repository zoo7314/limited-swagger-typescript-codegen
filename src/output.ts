import { emptyDir, ensureDir, outputFile } from "fs-extra"
import { resolve } from "path"
import * as objects from './objects'
import { SchemaFileModel, ServiceFileModel } from "./types"
import templates from "./templates"
import Handlebars from "handlebars"




export async function output({
  result = objects.parseResult(),
  dest = '',
}) {
  const {
    schemas,
    services,
    main,
  } = result
  registerTemplates()
  await cleanup({ dest })
  await outputSchemas({ schemas, dest })
  await outputServices({ services, dest })
  await outputMainFile({ main, dest })
}



function registerTemplates(): void {
  Handlebars.registerPartial(
    'objectSchema', templates.partials.objectSchema,
  )
  Handlebars.registerPartial(
    'api', templates.partials.api,
  )
  Handlebars.registerPartial(
    'requestConfigEntry', templates.partials.requestConfigEntry,
  )
  Handlebars.registerPartial(
    'importDecl', templates.partials.importDecl,
  )
}






async function outputSchemas({
  schemas = Array<SchemaFileModel>(0),
  dest = '',
}) {
  const dirPath = resolve(dest, './schemas')
  await ensureDir(dirPath)
  await emptyDir(dirPath)
  for (const item of schemas) {
    const content = Handlebars
      .compile(templates.schema, { noEscape: true })(item)
    await outputFile(
      resolve(dirPath, `./${item.schema.identifier}.ts`),
      content,
    )
  }
}

async function outputServices({
    services = Array<ServiceFileModel>(0),
    dest = '',
  }) {
  const dirPath = resolve(dest, './services')
  await ensureDir(dirPath)
  await emptyDir(dirPath)
  for (const item of services) {
    const content = Handlebars
      .compile(templates.service, { noEscape: true })(item)
    await outputFile(
      resolve(dirPath, `./${item.name}.ts`),
      content
    )
  }
}

async function outputMainFile({
    main = objects.mainFileModel(),
    dest = '',
  }) {
  const dirPath = resolve(dest)
  const content = Handlebars
    .compile(templates.main, { noEscape: true })(main)
  await outputFile(
    resolve(dirPath, './index.ts'),
    content
  )
}

async function cleanup({
    dest = '',
}) {
  await ensureDir(dest)
  await emptyDir(dest)
}
