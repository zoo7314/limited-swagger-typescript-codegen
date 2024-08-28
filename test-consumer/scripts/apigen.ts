import { gen, workplacePreset } from 'limited-swagger-typescript-codegen'
import { resolve } from 'path'

const __dirname = import.meta.dirname

async function genCopfAdmin() {
  await gen({
    input: await import('../workplaceApiDocs/copf-admin.json'),
    output: resolve(__dirname, '../src/api/generated'),
    clientPath: '@/client',
    prefix: '/dev-api',
    preset: workplacePreset,
  })
}

async function genCopfSite() {
  await gen({
    input: await import('../workplaceApiDocs/copf-site.json'),
    output: resolve(__dirname, '../src/api/generated'),
    clientPath: '@/client',
    prefix: '/stage-api',
    preset: workplacePreset,
  })
}

async function genVal() {
  await gen({
    input: await import('../workplaceApiDocs/val.json'),
    output: resolve(__dirname, '../src/api/generated'),
    clientPath: '@/client',
    preset: workplacePreset,
  })
}

async function genPortal() {
  await gen({
    // input: await import('../workplaceApiDocs/portal.json'),
    input: 'http://100.98.0.200:20151/v2/api-docs',
    output: resolve(__dirname, '../src/api/generated'),
    clientPath: '@/client',
    prefix: '/stage-api',
    preset: workplacePreset,
  })
}

async function genGptSite() {
  await gen({
    input: 'http://100.98.0.200:20160/v2/api-docs',
    output: resolve(__dirname, '../src/api/generated'),
    clientPath: '@/client',
    prefix: '',
    preset: workplacePreset,
  })
}


// genCopfAdmin()
// genCopfSite()
// genVal()
// genGptSite()
genPortal()








