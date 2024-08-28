import { emptyDir, ensureDir, outputFile } from "fs-extra"
import { resolve } from "path"
import templates from "./templates"
import Handlebars from "handlebars"
import { ParseResult } from "./entities/ParseResult"
import { SchemaOutputModel } from "./entities/SchemaOutputModel"
import { ServiceOutputModel } from "./entities/ServiceOutputModel"
import { MainOutputModel } from "./entities/MainOutputModel"




export async function output({
  result = ParseResult.create(),
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
  schemas = Array<SchemaOutputModel>(0),
  dest = '',
}) {
  const dirPath = resolve(dest, './schemas')
  await ensureDir(dirPath)
  await emptyDir(dirPath)
  for (const item of schemas) {
    const template = Handlebars
      .compile(templates.schema, { noEscape: true, })
    const content = template(item, {
      allowProtoPropertiesByDefault: true,
    })
    await outputFile(
      resolve(dirPath, `./${item.schema.identifier}.ts`),
      content,
    )
  }
}

async function outputServices({
    services = Array<ServiceOutputModel>(0),
    dest = '',
  }) {
  const dirPath = resolve(dest, './services')
  await ensureDir(dirPath)
  await emptyDir(dirPath)
  for (const item of services) {
    const template = Handlebars
      .compile(templates.service, { noEscape: true, })
    const content = template(item, {
      allowProtoPropertiesByDefault: true,
    })
    await outputFile(
      resolve(dirPath, `./${item.name}.ts`),
      content
    )
  }
}

async function outputMainFile({
    main = MainOutputModel.create(),
    dest = '',
  }) {
  const dirPath = resolve(dest)
  const template = Handlebars
    .compile(templates.main, { noEscape: true, })
  const content = template(main, {
    allowProtoPropertiesByDefault: true,
  })
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
