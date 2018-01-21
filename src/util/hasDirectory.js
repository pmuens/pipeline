import fse from 'fs-extra'
import BbPromise from 'bluebird'

const fsp = BbPromise.promisifyAll(fse)

async function hasDirectory(dirPath) {
  return fsp.pathExistsAsync(dirPath).then((exists) => exists)
}

export default hasDirectory
