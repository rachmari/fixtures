module.exports = writeApiResponses

const {resolve, dirname} = require('path')
const writeFile = require('fs').writeFileSync

function writeApiResponses (fpath, filename, rawResponse) {
  const path = resolve(__dirname, '..', 'scenarios', fpath)
  return writeFile(resolve(path, filename), JSON.stringify(rawResponse, null, 2) + '\n')
}
