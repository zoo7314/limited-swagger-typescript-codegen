const { readFileSync } = require("fs");
const { extname, resolve, dirname } = require("path");
const handlebars = require('handlebars')


const hbsPlugin = () => ({
  resolveId: (file, importer) => {
    if (extname(file) === '.hbs') {
      return resolve(dirname(importer), file);
    }
    return null;
  },
  load: file => {
    if (extname(file) === '.hbs') {
      const template = readFileSync(file, 'utf8').toString().trim();
      return `
        const template = \`${template}\n\`;
        export default template;
      `;
    }
    return null;
  },
});

module.exports = hbsPlugin
