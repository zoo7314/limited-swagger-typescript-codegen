const { resolve } = require('path')
const gen = require('../')
const apiDocJsonCopfAdmin = require('./realApiFiles/copf-admin.json')
const apiDocJsonVal = require('./realApiFiles/val.json')
const apiDocJsonPortal = require('./realApiFiles/portal.json')

const urls = {
  copfAdmin: 'http://172.18.100.70:20136/v2/api-docs',
  copfSite: 'http://172.18.100.70:20137/v2/api-docs',
  portal: 'http://100.98.0.200:20151/v2/api-docs',
  val: 'http://100.98.0.200:20176/v2/api-docs',
}

async function main() {
  try {
    await gen({
      // input: urls.copfAdmin,
      input: urls.portal,
      // input: urls.copfSite,
      // input: urls.val,
      // input: apiDocJsonCopfAdmin,
      // input: apiDocJsonVal,
      // input: apiDocJsonPortal,
      dest: resolve(__dirname, './generated'),
      config: {
        clientPath: '../../client',
        prefix: '/dev-api',
        // prefix: '/stage-api',
        // prefix: '',
      },
    })
  } catch (error) {
    console.log(error)
  }
}


main()

