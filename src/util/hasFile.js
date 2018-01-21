import fs from 'fs'
import BbPromise from 'bluebird'

const fsp = BbPromise.promisifyAll(fs)

async function hasFile(filePath) {
  return fsp
    .statAsync(filePath)
    .then(() => true)
    .catch(() => false)
}

export default hasFile
