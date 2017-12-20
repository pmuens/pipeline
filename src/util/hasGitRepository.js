import path from 'path'
import fse from 'fs-extra'
import BbPromise from 'bluebird'

const fsp = BbPromise.promisifyAll(fse)

async function hasGitRepository(dirPath) {
  return fsp.pathExistsAsync(path.join(dirPath, '.git')).then((exists) => exists)
}

export default hasGitRepository
