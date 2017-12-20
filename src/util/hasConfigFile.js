import path from 'path'
import fs from 'fs'
import BbPromise from 'bluebird'

const fsp = BbPromise.promisifyAll(fs)

async function hasConfigFile(dirPath) {
  return fsp
    .statAsync(path.join(dirPath, '.pipeline.yml'))
    .then(() => true)
    .catch(() => false)
}

export default hasConfigFile
