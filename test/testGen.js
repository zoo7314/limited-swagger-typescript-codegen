const { resolve } = require('path')
const gen = require('../')

async function genCopfAdmin() {
  await gen({
    input: 'http://172.18.100.70:20136/v2/api-docs',
    dest: resolve(__dirname, './generated'),
    clientPath: '../../client',
    prefix: '/dev-api',
  })
}

async function genCopfSite() {
  await gen({
    input: 'http://172.18.100.70:20137/v2/api-docs',
    dest: resolve(__dirname, './generated'),
    clientPath: '../../client',
    prefix: '/stage-api',
  })
}

async function genPortal() {
  await gen({
    input: 'http://100.98.0.200:20151/v2/api-docs',
    dest: resolve(__dirname, './generated'),
    clientPath: '../../client',
    prefix: '/stage-api',
    rewriteInputTypeSchema: (schema) => {
      if (schema.$ref === '#/definitions/String') {
        return { type: 'string' }
      }
    },
  })
}

async function genVal() {
  await gen({
    input: 'http://100.98.0.200:20176/v2/api-docs',
    dest: resolve(__dirname, './generated'),
    clientPath: '../../client',
    prefix: '/stage-api',
  })
}






async function main() {
  try {
    await genCopfAdmin()
    // await genCopfSite()
    // await genPortal()
    // await genVal()
  } catch (error) {
    console.log(error)
  }
}


main()

