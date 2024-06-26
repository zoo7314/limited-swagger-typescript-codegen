#!/usr/bin/env node
const { program } = require('commander');
const pkg = require('../package.json');

const params = program
    .name('limited-swagger-typescript-codegen')
    .usage('[options]')
    .version(pkg.version)
    .requiredOption('-i, --input <value>', 'url used to fetch the json object (required)')
    .requiredOption('-d, --dest <value>', 'output directory (required)')
    .option('-c, --clientPath <value>', 'path of file that exports AxiosInstance (default: "@/client")', '@/client')
    .option('-p, --prefix <value>', 'url prefix, will be removed in outputs (default: "")', '')
    .parse(process.argv)
    .opts();

const gen = require('../dist/index')

gen({
  input: params.input,
  dest: params.dest,
  clientPath: params.clientPath,
  prefix: params.prefix,
})
  .then(() => {
    process.exit(0)
  })
  .catch(error => {
    console.error(error)
    process.exit(1)
  })



