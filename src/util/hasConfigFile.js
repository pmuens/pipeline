import path from 'path'
import fs from 'fs'
import Promise from 'bluebird'

const fsp = Promise.promisifyAll(fs)

async function hasConfigFile(dirPath) {
  return fsp
    .statAsync(path.join(dirPath, '.pipelines.yml'))
    .then(() => true)
    .catch(() => false)
}

export default hasConfigFile
